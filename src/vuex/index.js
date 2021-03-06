import axios from 'axios'
import { compareAsc, format, parseISO } from 'date-fns'
import numbro from 'numbro'
import { all, hash } from 'rsvp'
import { createStore } from 'vuex'

import teamMap from '@/util/teamMap'

const createScorebug = gameData => {
  if (!gameData) return null
  const isPregame = gameData.schedule.status.abstractGameCode === 'P'

  const obj = {
    gamePk: gameData.gamePk,
    isTop: gameData.lineScore.isTopInning,
    inProgress: gameData.inProgress,
    isPregame,
    gameTime: gameData.gameTime,
    gameDate: gameData.gameDate,
    home: {
      team: gameData.home.short,
      bgClass: gameData.home.bgClass,
      textClass: gameData.home.textClass,
      score: gameData.lineScore.teams.home.runs || 0,
      currentPlayer: null
    },
    away: {
      team: gameData.away.short,
      bgClass: gameData.away.bgClass,
      textClass: gameData.away.textClass,
      score: gameData.lineScore.teams.away.runs || 0,
      currentPlayer: null
    }
  }

  if (obj.isTop) {
    obj.home.currentPlayer = gameData.boxScore.teams.home.players[`ID${(gameData.lineScore.defense.pitcher || {}).id}`]
    obj.away.currentPlayer = gameData.boxScore.teams.away.players[`ID${(gameData.lineScore.offense.batter || {}).id}`]
    obj.away.order = obj.away.currentPlayer ? `${Math.floor(Number(obj.away.currentPlayer.battingOrder) / 100)}.` : ''
  } else {
    obj.home.currentPlayer = gameData.boxScore.teams.home.players[`ID${(gameData.lineScore.offense.batter || {}).id}`]
    obj.away.currentPlayer = gameData.boxScore.teams.away.players[`ID${(gameData.lineScore.defense.pitcher || {}).id}`]
    obj.home.order = obj.home.currentPlayer ? `${Math.floor(Number(obj.home.currentPlayer.battingOrder) / 100)}.` : ''
  }

  if (obj.inProgress) {
    obj.inning = gameData.lineScore.currentInning
    obj.displaySide = true
    obj.batterCount = `${gameData.lineScore.balls}-${gameData.lineScore.strikes}`
    obj.outs = [gameData.lineScore.outs >= 1, gameData.lineScore.outs >= 2]
    obj.runners = [{ num: 1, runner: !!gameData.lineScore.offense.first }, {
      num: 2,
      runner: !!gameData.lineScore.offense.second
    }, { num: 3, runner: !!gameData.lineScore.offense.third }]
  } else {
    obj.statusCode = gameData.schedule.status.abstractGameCode
    obj.displaySide = false
    obj.batterCount = null
    obj.outs = [false, false]
    obj.runners = [{ num: 1, runner: false }, { num: 2, runner: false }, { num: 3, runner: false }]
  }

  return obj
}

const getGame = (schedule, host) => {
  const homeTeam = teamMap.find(t => t.id === schedule.teams.home.team.id)
  const awayTeam = teamMap.find(t => t.id === schedule.teams.away.team.id)

  const isOver = schedule.status.abstractGameCode === 'F'
  const isPregame = schedule.status.abstractGameCode === 'P'

  const colorConflict = (homeTeam?.conflicts || []).includes(awayTeam?.short)
  let teamPriority = 'home';

  if ((awayTeam?.priority || Number.MAX_SAFE_INTEGER) < (homeTeam?.priority || Number.MAX_SAFE_INTEGER)) {
    teamPriority = 'away'
  }

  const gameObj = {
    lineScore: axios.get(`${host}/game/${schedule.gamePk}/linescore`).then(({ data }) => data),
    boxScore: axios.get(`${host}/game/${schedule.gamePk}/boxscore`).then(({ data }) => data),
    schedule,
    gamePk: `${schedule.gamePk}`,
    gameTime: parseISO(schedule.gameDate),
    inProgress: !isOver && !isPregame,
    home: {
      short: homeTeam?.short.toUpperCase(),
      name: homeTeam?.name,
      bgClass: homeTeam?.mainBackground,
      textClass: homeTeam?.mainText
    },
    away: {
      short: awayTeam?.short.toUpperCase(),
      name: awayTeam?.name,
      bgClass:awayTeam?.mainBackground,
      textClass: awayTeam?.mainText
    }
  }

  gameObj.gameDate = format(gameObj.gameTime, 'yyyy-MM-dd')

  if (colorConflict) {
    if (teamPriority === 'home') {
      gameObj.home.bgClass = homeTeam?.mainBackground;
      gameObj.home.textClass = homeTeam?.mainText;
      gameObj.away.bgClass = awayTeam?.secondaryBackground;
      gameObj.away.textClass = awayTeam?.secondaryText;
    } else {
      gameObj.home.bgClass = homeTeam?.secondaryBackground;
      gameObj.home.textClass = homeTeam?.secondaryText;
      gameObj.away.bgClass = awayTeam?.mainBackground;
      gameObj.away.textClass = awayTeam?.mainText;
    }
  }

  return hash(gameObj)
}

// Create a new store instance.
export default createStore({
  state() {
    return {
      games: [],
      players: {},
      leagueLeaders: { american: [], national: [] },
      standings: { american: [], national: [] },
      diffs: [],
      apiHost: 'https://statsapi.mlb.com/api/v1',
      locale: localStorage.getItem('locale'),
      date: new Date()
    }
  },
  getters: {
    getLocale: state => state.locale,
    getDate: state => state.date,
    getGame: state => gamePk => state.games.find(g => g.gamePk === gamePk),
    scorebugGames: state => date => state.games
      .map(game => {
        if (!game || date !== game.gameDate) return null
        return createScorebug(game)
      })
      .filter(v => v)
      .sort((a, b) => compareAsc(a.gameTime, b.gameTime)),
    getScorebug: (state, getters) => gamePk => createScorebug(getters.getGame(gamePk)),
    getTeamBattersForGame: (state, getters) => (gamePk, team) => {
      const game = getters.getGame(gamePk)

      if (!game) return []

      const mapBatter = player => {
        player.stats.batting.avg = numbro((player.stats.batting.hits || 0) / (player.stats.batting.atBats || 1)).format({ mantissa: 3 }).replace(/^0/, '')
        player.stats.batting.singles = player.stats.batting.hits - player.stats.batting.doubles - player.stats.batting.triples - player.stats.batting.homeRuns
        return player
      }

      if (team === 'home') {
        return game.boxScore.teams.home.batters
          .map(id => game.boxScore.teams.home.players[`ID${id}`])
          .filter(b => b.stats.batting.plateAppearances !== undefined)
          .map(mapBatter)
      } else {
        return game.boxScore.teams.away.batters
          .map(id => game.boxScore.teams.away.players[`ID${id}`])
          .filter(b => b.stats.batting.plateAppearances !== undefined)
          .map(mapBatter)
      }
    },
    getTeamPitchersForGame: (state, getters) => (gamePk, team) => {
      const game = getters.getGame(gamePk)

      if (!game) return null

      const mapPitcher = (player, i) => {
        player.stats.pitching.era = numbro((player.stats.pitching.earnedRuns * 9 || 0) / (Number(player.stats.pitching.inningsPitched) || 1)).format({ mantissa: 2 })
        player.index = `${i + 1}.`
        return player
      }

      if (team === 'home') {
        return game.boxScore.teams.home.pitchers
          .map(id => game.boxScore.teams.home.players[`ID${id}`])
          .map(mapPitcher)
      } else {
        return game.boxScore.teams.away.pitchers
          .map(id => game.boxScore.teams.away.players[`ID${id}`])
          .map(mapPitcher)
      }
    },
    getBoxScore: (state, getters) => gamePk => {
      const game = getters.getGame(gamePk)

      if (!game) return null

      const obj = {
        gameTime: game.gameTime,
        gameDate: game.gameDate,
        home: {
          name: game.home.name,
          bgClass: game.home.bgClass,
          textClass: game.home.textClass,
          innings: []
        },
        away: {
          name: game.away.name,
          bgClass: game.away.bgClass,
          textClass: game.away.textClass,
          innings: []
        }
      }

      game.lineScore.innings.forEach(inning => {
        obj.home.innings.push(inning.home)
        obj.away.innings.push(inning.away)
      })

      if (game.lineScore.innings.length < game.schedule.scheduledInnings) {
        for (let i = game.lineScore.innings.length; i < game.schedule.scheduledInnings; i++) {
          obj.home.innings.push({ runs: null, hits: null, errors: null })
          obj.away.innings.push({ runs: null, hits: null, errors: null })
        }
      }

      const sumField = (array, field) => array.reduce((a, b) => a + Number(b[field] === 'x' ? 0 : b[field] || 0), 0)

      obj.home.runs = sumField(obj.home.innings, 'runs')
      obj.away.runs = sumField(obj.away.innings, 'runs')

      obj.home.hits = sumField(obj.home.innings, 'hits')
      obj.away.hits = sumField(obj.away.innings, 'hits')

      obj.home.errors = sumField(obj.home.innings, 'errors')
      obj.away.errors = sumField(obj.away.innings, 'errors')

      obj.isPregame = game.schedule.status.abstractGameCode === 'P'
      obj.inProgress = game.inProgress
      obj.status = game.schedule.status.abstractGameState
      obj.statusCode = game.schedule.status.abstractGameCode

      const isOver = game.schedule.status.abstractGameCode === 'F'
      if (obj.home.runs > obj.away.runs && !obj.home.innings[game.schedule.scheduledInnings - 1].runs && isOver) {
        obj.home.innings[game.schedule.scheduledInnings - 1].runs = 'x'
      }

      obj.home.batters = game.boxScore.teams.home.batters.map(id => game.boxScore.teams.home.players[`ID${id}`])
      obj.away.batters = game.boxScore.teams.away.batters.map(id => game.boxScore.teams.away.players[`ID${id}`])

      return obj
    },
    getLeagueLeaders: state => state.leagueLeaders,
    getPlayer: state => playerId => state.players[playerId] || {},
    getStandings: state => state.standings,
    getDiffs: state => state.diffs
  },
  mutations: {
    updateGames(state, newGames) {
      state.games.splice(0, state.games.length)
      newGames.forEach((g, i) => (state.games[i] = g));
    },
    updateGame(state, newGame) {
      const index = state.games.findIndex(g => g.gamePk === newGame.gamePk)

      if (index >= 0) {
        state.games.splice(index, 1, newGame)
      } else {
        state.games.push(newGame)
      }
    },
    updateLeagueLeaders(state, newLeaders) {
      state.leagueLeaders.american = newLeaders.american
      state.leagueLeaders.national = newLeaders.national
    },
    updateLocale(state, newLocale) {
      localStorage.setItem('locale', newLocale)
      state.locale = newLocale
    },
    savePlayer(state, player) {
      state.players[player.id] = player
    },
    updateDate(state, date) {
      state.date = date
    },
    updateStandings(state, standings) {
      state.standings = standings
    },
    updateDiffs(state, diffs) {
      state.diffs = diffs
    }
  },
  actions: {
    async fetchGamesForDay({ commit, state }, date) {
      const scheduleData = await axios.get(`${state.apiHost}/schedule`, { params: { sportId: 1, date } }).then(({ data: { dates: [dateData] } }) => dateData?.games || [])
      const gameData = await all(scheduleData.map(d => getGame(d, state.apiHost)))
      commit('updateGames', gameData)
    },
    async fetchGame({ commit, state }, gamePk) {
      const scheduleData = await axios.get(`${state.apiHost}/schedule`, { params: { sportId: 1, gamePk } }).then(({ data: { dates: [{ games }] } }) => games)
      const game = await getGame(scheduleData[0], state.apiHost)
      commit('updateGame', game)
    },
    async fetchLeagueLeaders({ commit, state }, { statGroup, type }) {
      if (!statGroup && !type) return commit('updateLeagueLeaders', { american: [], national: [] })

      let url = `${state.apiHost}/stats/leaders?sportId=1&statGroup=${statGroup}&statType=season&leaderCategories=${type}&limit=10`

      const noneQualified = ['saves', 'blownSaves', 'holds', 'saveOpportunities']

      if (!noneQualified.includes(type)) {
        url += '&playerPool=qualified'
      }

      return hash({
        american: axios.get(`${url}&leagueId=103`)
          .then(({ data: { leagueLeaders: [{ leaders = [] }] } }) => leaders),
        national: axios.get(`${url}&leagueId=104`)
          .then(({ data: { leagueLeaders: [{ leaders = [] }] } }) => leaders)
      })
        .then(leagueLeaders => commit('updateLeagueLeaders', leagueLeaders))
    },
    async fetchPlayer({ commit, state }, playerID) {
      const player = await axios
        .get(`${state.apiHost}/people/${playerID}?hydrate=stats(group=[hitting,pitching,fielding],type=[season,career,yearByYear],currentTeam)`)
        .then(({ data: { people: [person] } }) => person)

      commit('savePlayer', player)
    },
    async fetchStandings({ commit, state }) {
      const fetchDivisions = records => {
        return all(
          records.map(r => {
            r.division = axios.get(`${state.apiHost}/divisions/${r.division.id}`).then(({ data: { divisions: [division] } }) => division)
            return hash(r)
          })
        )
      }

      const addTeamMapData = ({ teamRecords }) => {
        teamRecords.forEach(tr => {
          tr.team = {
            ...tr.team,
            ...teamMap.find(t => t.id === tr.team.id)
          };
        })
      }

      const year = format(new Date(), 'yyyy')

      const americanStandings = await axios
        .get(`${state.apiHost}/standings?leagueId=103&season=${year}`)
        .then(({ data: { records }}) => fetchDivisions(records))

      const nationalStandings = await axios
        .get(`${state.apiHost}/standings?leagueId=104&season=${year}`)
        .then(({ data: { records }}) => fetchDivisions(records))

      americanStandings.forEach(addTeamMapData)
      nationalStandings.forEach(addTeamMapData)

      commit('updateStandings', {
        american: [
          americanStandings.find(s => s.division.id === 200),
          americanStandings.find(s => s.division.id === 202),
          americanStandings.find(s => s.division.id === 201)
        ],
        national: [
          nationalStandings.find(s => s.division.id === 203),
          nationalStandings.find(s => s.division.id === 205),
          nationalStandings.find(s => s.division.id === 204)
        ]
      })
    },
    async fetchWinDifferentials({ commit, state }) {
      const year = format(new Date(), 'yyyy')
      const { regularSeasonStartDate, regularSeasonEndDate } = await axios.get(`${state.apiHost}/seasons/${year}/?sportId=1`).then(({ data: { seasons: [season] } }) => season)

      const diffs = await all(teamMap.map(team => {
        return axios.get(`${state.apiHost}/schedule?sportId=1&teamId=${team.id}&startDate=${regularSeasonStartDate}&endDate=${regularSeasonEndDate}`)
          .then(({ data: { dates = [] } }) => {
            let diff = 0
            let count = 0

            const gamesAbove500 = dates
              .map(d => d.games)
              .reduce((accumulator, games) => accumulator.concat(games), [])
              .filter(g => g.status.codedGameState === 'F')
              .map(g => {
                if (g.teams.away.team.id === team.id) {
                  g.teams.away.date = g.officialDate
                  return g.teams.away
                } else {
                  g.teams.home.date = g.officialDate
                  return g.teams.home
                }
              })
              .reduce((accumulator, g) => {
                count += 1
                diff = diff + (g.isWinner ? 1 : -1)
                accumulator.push({ date: g.date, diff, count, isWinner: g.isWinner })
                return accumulator
              }, [])

            return {
              seasonDiffs: gamesAbove500,
              overallDiff: diff,
              ...team
            }
          })
      }))

      diffs.sort((a, b) => a.overallDiff < b.overallDiff ? -1 : 1)

      commit('updateDiffs', diffs)
    }
  }
})

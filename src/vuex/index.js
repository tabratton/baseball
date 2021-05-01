import axios from 'axios'
import { compareAsc, format, parseISO } from 'date-fns'
import { all, hash } from 'rsvp'
import { createStore } from 'vuex'

import teamMap from '@/util/teamMap'

// Create a new store instance.
export default createStore({
  state() {
    return {
      games: [],
      apiHost: 'https://statsapi.mlb.com/api/v1'
    }
  },
  mutations: {
    updateGames(state, newGames) {
      state.games = newGames
    }
  },
  actions: {
    async updateGames({ commit, state }) {
      const date = format(new Date(), 'yyyy-MM-dd')
      const scheduleData = await axios.get(`${state.apiHost}/schedule`, { params: { sportId: 1, date } }).then(({ data: { dates: [{ games }] } }) => games)
      const gameData = await all(scheduleData.map(d => {
        const homeTeam = teamMap.find(t => t.id === d.teams.home.team.id)
        const awayTeam = teamMap.find(t => t.id === d.teams.away.team.id)

        const schedule = scheduleData.find(s => s.gamePk === d.gamePk)

        const isOver = schedule.status.statusCode === 'F' || schedule.status.statusCode === 'DR' || schedule.status.statusCode === 'O'
        const isPregame = schedule.status.statusCode === 'P' || schedule.status.statusCode === 'S'

        const colorConflict = (homeTeam.conflicts || []).includes(awayTeam.short)
        let teamPriority = 'home';

        if ((awayTeam.priority || Number.MAX_SAFE_INTEGER) < (homeTeam.priority || Number.MAX_SAFE_INTEGER)) {
          teamPriority = 'away'
        }

        const gameObj = {
          lineScore: axios.get(`${state.apiHost}/game/${d.gamePk}/linescore`).then(({ data }) => data),
          boxScore: axios.get(`${state.apiHost}/game/${d.gamePk}/boxscore`).then(({ data }) => data),
          schedule,
          gamePk: `${d.gamePk}`,
          gameTime: parseISO(d.gameDate),
          inProgress: !isOver && !isPregame,
          home: {
            short: homeTeam.short.toUpperCase(),
            name: homeTeam.name,
            bgClass: homeTeam.mainBackground,
            textClass: homeTeam.mainText
          },
          away: {
            short: awayTeam.short.toUpperCase(),
            name: awayTeam.name,
            bgClass:awayTeam.mainBackground,
            textClass: awayTeam.mainText
          }
        }

        if (colorConflict) {
          if (teamPriority === 'home') {
            gameObj.home.bgClass = homeTeam.mainBackground;
            gameObj.home.textClass = homeTeam.mainText;
            gameObj.away.bgClass = awayTeam.secondaryBackground;
            gameObj.away.textClass = awayTeam.secondaryText;
          } else {
            gameObj.home.bgClass = homeTeam.secondaryBackground;
            gameObj.home.textClass = homeTeam.secondaryText;
            gameObj.away.bgClass = awayTeam.mainBackground;
            gameObj.away.textClass = awayTeam.mainText;
          }
        }

        return hash(gameObj)
      }))

      const sorted = gameData.sort((a, b) => compareAsc(a.gameTime, b.gameTime))

      commit('updateGames', sorted)
    }
  }
})

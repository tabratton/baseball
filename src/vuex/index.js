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

        return hash({
          lineScore: axios.get(`${state.apiHost}/game/${d.gamePk}/linescore`).then(({ data }) => data),
          boxScore: axios.get(`${state.apiHost}/game/${d.gamePk}/boxscore`).then(({ data }) => data),
          schedule,
          gamePk: `${d.gamePk}`,
          gameTime: parseISO(d.gameDate),
          inProgress: !isOver && !isPregame,
          home: {
            short: homeTeam.short.toUpperCase(),
            name: homeTeam.name,
            bgClass: colorConflict ? homeTeam.secondaryBackground : homeTeam.mainBackground,
            textClass: colorConflict ? homeTeam.mainText : homeTeam.mainText
          },
          away: {
            short: awayTeam.short.toUpperCase(),
            name: awayTeam.name,
            bgClass: colorConflict ? awayTeam.secondaryBackground : awayTeam.mainBackground,
            textClass: colorConflict ? awayTeam.mainText : awayTeam.mainText
          }
        })
      }))

      const sorted = gameData.sort((a, b) => compareAsc(a.gameTime, b.gameTime))

      commit('updateGames', sorted)
    }
  }
})

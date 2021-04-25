import { compareAsc, parseISO } from 'date-fns'
import MLBStatsAPI from 'mlb-stats-api'
import { all, hash } from 'rsvp'
import { createStore } from 'vuex'

import teamMap from '@/util/teamMap'

// Create a new store instance.
export default createStore({
  state() {
    return {
      games: [],
      mlbStats: new MLBStatsAPI()
    }
  },
  mutations: {
    updateGames(state, newGames) {
      state.games = newGames
    }
  },
  actions: {
    async updateGames({ commit, state }) {
      const scheduleData = await state.mlbStats.getSchedule({ params: { sportId: 1 } }).then(({ data: { dates: [{ games }] } }) => games)
      const gameData = await all(scheduleData.map(d => {
        const homeTeam = teamMap.find(t => t.id === d.teams.home.team.id)
        const awayTeam = teamMap.find(t => t.id === d.teams.away.team.id)

        return hash({
          lineScore: state.mlbStats.getGameLinescore({ pathParams: { gamePk: d.gamePk } }).then(({ data }) => data),
          boxScore: state.mlbStats.getGameBoxscore({ pathParams: { gamePk: d.gamePk }}).then(({ data }) => data),
          schedule: scheduleData.find(s => s.gamePk === d.gamePk),
          gamePk: `${d.gamePk}`,
          gameTime: parseISO(d.gameDate),
          home: {
            short: homeTeam.short.toUpperCase(),
            name: homeTeam.name,
            bgClass: homeTeam.bgClass,
          },
          away: {
            short: awayTeam.short.toUpperCase(),
            name: awayTeam.name,
            bgClass: awayTeam.bgClass,
          }
        })
      }))

      const sorted = gameData.sort((a, b) => compareAsc(a.gameTime, b.gameTime))

      commit('updateGames', sorted)
    }
  }
})

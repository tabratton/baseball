<template>
  <div class="home w-full flex justify-center">
    <div class="flex flex-row flex-wrap w-2/3 mt-12">
      <Scorebug v-for="g in model" :key="g.gamePk" :game="g"/>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import MLBStatsAPI from 'mlb-stats-api'
import { all, hash } from 'rsvp'

import Scorebug from '@/components/Scorebug.vue'

import teamMap from '@/util/teamMap'

export default {
  name: 'Home',
  components: {
    Scorebug
  },
  setup(props, { emit }) {
    const model = ref([])
    const timer = ref(null)

    const mlbStats = new MLBStatsAPI()

    const fetchData = async () => {
      const scheduleData = await mlbStats.getSchedule({ params: { sportId: 1 } }).then(({ data: { dates: [{ games }] } }) => games)
      const gameData = await all(
          scheduleData
              .map(d => hash({
                lineScore: mlbStats.getGameLinescore({ pathParams: { gamePk: d.gamePk } }).then(({ data }) => data),
                schedule: scheduleData.find(s => s.gamePk === d.gamePk),
                gamePk: d.gamePk
              }))
      )

      model.value = gameData.map(game => {
        const isOver = game.schedule.status.statusCode === 'F' || game.schedule.status.statusCode === 'DR' || game.schedule.status.statusCode === 'O'
        const homeTeam = teamMap.find(t => t.id === game.schedule.teams.home.team.id)
        const awayTeam = teamMap.find(t => t.id === game.schedule.teams.away.team.id)

        return {
          gamePk: game.gamePk,
          inning: isOver ? game.schedule.status.abstractGameState : game.lineScore.currentInning,
          isTop: game.lineScore.isTopInning,
          batterCount: isOver ? '' : `${game.lineScore.balls}-${game.lineScore.strikes}`,
          outs: isOver ? [false, false] : [game.lineScore.outs >= 1, game.lineScore.outs >= 2],
          runners: isOver ? [false, false, false] : [!!game.lineScore.offense.first, !!game.lineScore.offense.second, !!game.lineScore.offense.third],
          home: {
            team: homeTeam.short.toUpperCase(),
            bgClass: homeTeam.bgClass,
            current: { score: game.lineScore.teams.home.runs }
          },
          away: {
            team: awayTeam.short.toUpperCase(),
            bgClass: awayTeam.bgClass,
            current: { score: game.lineScore.teams.away.runs }
          }
        }
      })
    }

    onMounted(() => {
      fetchData()
      timer.value = setInterval(fetchData, 60000)
    })

    onBeforeUnmount(() => clearInterval(timer))

    return {
      model,
      emit
    }
  }
}
</script>

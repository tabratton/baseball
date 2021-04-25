<template>
  <div class="flex justify-between scorebug m-2 cursor-pointer" @click="goToBoxscore()">
    <table class="table-auto w-full text-white h-30">
      <caption class="sr-only">Score</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">Team</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="game.away.bgClass">
          <td>{{ game.away.team }}</td>
          <td class="text-right">{{ game.away.current.score }}</td>
        </tr>

        <tr :class="game.home.bgClass">
          <td>{{ game.home.team }}</td>
          <td class="text-right">{{ game.home.current.score }}</td>
        </tr>

        <tr class="bg-gray-900">
          <td class="pl-0" v-if="game.inning !== 'Final' && game.inning !== 'Postponed'">
                <span class="flex items-center justify-start w-full">
                  <svg
                      :class="game.isTop ? 'transform -translate-y-1' : 'transform rotate-180 transform translate-y-1'"
                      style="width:24px;height:24px"
                      viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="M7,15L12,10L17,15H7Z"/>
                  </svg>
                  <span>{{ game.inning }}</span>
                </span>
          </td>
          <td v-if="game.inning === 'Final' || game.inning === 'Postponed'">{{ game.inning }}</td>
          <td class="text-right">{{ game.batterCount }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-col justify-center w-28 h-30 items-center bg-gray-900">
      <div class="flex-grow w-28">
        <div class="w-16 h-16 flex flex-wrap transform rotate-45 translate-x-6 translate-y-6">
          <div :class="game.runners[1] ? 'base active' : 'base inactive'"></div>
          <div :class="game.runners[0] ? 'base active' : 'base inactive'"></div>
          <div :class="game.runners[2] ? 'base active' : 'base inactive'"></div>
          <div class="w-5 h-5 mt-2 ml-2 bg-gray-50"></div>
        </div>
      </div>
      <div class="flex justify-center items-center w-full">
        <div :class="game.outs[1] ? 'out-indicator active' : 'out-indicator inactive'"></div>
        <div :class="game.outs[0] ? 'out-indicator active' : 'out-indicator inactive'"></div>
      </div>
    </div>
    <table class="table-auto w-full text-white h-30" v-if="game.home.current.player && game.away.current.player">
      <caption class="sr-only">Current Pitcher/Batter</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">Player</th>
          <th scope="col">Stat</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-lad-main">
          <td class="pr-3 text-right">{{ `${teams.away.current.player.order} ${teams.away.current.player.name}` }}</td>
          <td class="pl-3 text-right">{{ teams.away.current.player.count }}</td>
        </tr>

        <tr class="bg-sdp-main">
          <td class="pr-3 text-right">{{ `${teams.home.current.player.order ? teams.home.current.player.order : ''} ${teams.home.current.player.name}` }}</td>
          <td class="pl-3 text-right">{{ teams.home.current.player.count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { toRefs } from 'vue'

export default {
  name: 'Scorebug',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const { game } = toRefs(props)

    const goToBoxscore = () => {
      router.push(`/game/${game.value.gamePk}`)
    }

    return {
      goToBoxscore
    }
  }
}
</script>

<style scoped>

</style>

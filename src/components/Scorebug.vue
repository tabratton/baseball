<template>
  <div
    :class="{ 'cursor-pointer': !disableClick }"
    class="scorebug flex m-2"
    @click="goToBoxscore()"
  >
    <table class="table-auto text-white">
      <caption class="sr-only">Score</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">Team</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="`${game.away.bgClass} ${game.away.textClass}`">
          <td class="pr-4">{{ game.away.team }}</td>
          <td class="pl-4 text-right">
            <span v-if="game.away.score < 10" class="text-transparent">0</span>
            {{ game.away.score }}
          </td>
        </tr>

        <tr :class="`${game.home.bgClass} ${game.home.textClass}`">
          <td class="pr-4">{{ game.home.team }}</td>
          <td class="pl-4 text-right">
            <span v-if="game.home.score < 10" class="text-transparent">0</span>
            {{ game.home.score }}
          </td>
        </tr>

        <tr class="bg-gray-900">
          <td class="pl-0 pr-4" v-if="game.displaySide">
            <span class="flex items-center justify-start w-full">
              <svg
                :class="{ '-translate-y-1': game.isTop }"
                class="transform rotate-180 translate-y-1"
                style="width:24px;height:24px"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M7,15L12,10L17,15H7Z"/>
              </svg>
              <span>{{ game.inning }}</span>
            </span>
          </td>
          <td v-if="!game.displaySide">{{ game.inning }}</td>
          <td class="text-right pl-4" v-if="game.batterCount">{{ game.batterCount }}</td>
          <td v-if="!game.batterCount"></td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-col justify-center w-28 items-center bg-gray-900">
      <div class="flex-grow w-28 relative">
        <div class="w-16 h-16 flex flex-wrap transform rotate-45 translate-x-6 translate-y-6 absolute">
          <div
            v-for="base in [game.runners.find(b => b.num === 2), game.runners.find(b => b.num === 1), game.runners.find(b => b.num === 3)]"
            :key="base.num"
            :class="{ 'active': base.runner}"
            class="base"
          ></div>
          <div class="w-5 h-5 mt-2 ml-2 bg-gray-50"></div>
        </div>
      </div>
      <div class="flex justify-center items-center w-full">
        <div
          :class="{ 'active': game.outs[0] }"
          class="out-indicator"
        ></div>
        <div
          :class="{ 'active': game.outs[1] }"
          class="out-indicator"
        ></div>
      </div>
    </div>
    <table
      v-if="game.home.currentPlayer && game.away.currentPlayer && game.displaySide"
      class="table-auto w-full text-white"
    >
      <caption class="sr-only">Current Pitcher/Batter</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">Player</th>
          <th scope="col">Stat</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="`${game.away.bgClass} ${game.away.textClass}`">
          <td class="text-right">{{ game.isTop ? `${game.away.order} ${game.away.currentPlayer.person.fullName}` : game.away.currentPlayer.person.fullName }}</td>
          <td class="text-right">{{ game.isTop ? `${game.away.currentPlayer.stats.batting.hits}-${game.away.currentPlayer.stats.batting.atBats}` : `${game.away.currentPlayer.stats.pitching.pitchesThrown}P` }}</td>
        </tr>

        <tr :class="`${game.home.bgClass} ${game.home.textClass}`">
          <td class="text-right">{{ game.isTop ? game.home.currentPlayer.person.fullName : `${game.home.order} ${game.home.currentPlayer.person.fullName}` }}</td>
          <td class="text-right">{{ game.isTop ? `${game.home.currentPlayer.stats.pitching.pitchesThrown}P` : `${game.home.currentPlayer.stats.batting.hits}-${game.home.currentPlayer.stats.batting.atBats}` }}</td>
        </tr>
        <tr class="bg-gray-900">
          <td class="p-4"></td>
          <td class="p-4"></td>
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
    },
    disableClick: {
      type: Boolean,
      required: false
    }
  },
  setup(props) {
    const router = useRouter()
    const { game } = toRefs(props)

    const goToBoxscore = () => router.push(`/game/${game.value.gamePk}`)

    return {
      goToBoxscore
    }
  }
}
</script>

<style scoped>
.scorebug table td {
  @apply whitespace-nowrap;
}

.out-indicator {
  @apply rounded-full w-4 h-4 m-2 bg-gray-500;
}

.base {
  @apply w-8 h-8 border-2 border-gray-800 bg-gray-500;
}

.active {
  @apply bg-yellow-600;
}
</style>

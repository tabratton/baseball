<template>
  <div
    :class="{ 'cursor-pointer': !disableClick }"
    class="scorebug flex m-2 rounded h-30"
  >
    <table
      class="table-auto text-white rounded"
      @click="goToBoxscore()"
    >
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
            {{ game.away.score }}
          </td>
        </tr>

        <tr :class="`${game.home.bgClass} ${game.home.textClass}`">
          <td class="pr-4">{{ game.home.team }}</td>
          <td class="pl-4 text-right">
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
          <td v-else>{{ game.inning }}</td>
          <td class="text-right pl-4">{{ game.batterCount ? game.batterCount : '' }}</td>
        </tr>
      </tbody>
    </table>
    <div
      class="flex flex-col justify-center w-28 items-center bg-gray-900"
      @click="goToBoxscore()"
    >
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
      v-if="playerInfoExpanded"
      class="table-auto w-full text-white rounded"
      @click="goToBoxscore()"
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
          <td class="p-5"></td>
          <td class="p-5"></td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="game.inProgress && game.home.currentPlayer && game.away.currentPlayer"
      class="text-white bg-gray-900 pt-2 pr-1 pl-1"
      @click="togglePlayerInfoExpanded"
    >
      <div class="cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            v-if="!playerInfoExpanded"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, toRefs } from 'vue'

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

    const playerInfoExpanded = ref(false)

    const togglePlayerInfoExpanded = () => (playerInfoExpanded.value = !playerInfoExpanded.value)

    const goToBoxscore = () => router.push(`/game/${game.value.gamePk}`)

    return {
      goToBoxscore,
      playerInfoExpanded,
      togglePlayerInfoExpanded
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

<template>
  <div
    :class="{ 'cursor-pointer': !disableClick }"
    class="scorebug flex m-2 rounded h-33"
  >
    <table
      class="table-auto text-gray-100"
      @click="goToBoxscore()"
    >
      <caption class="sr-only">{{ t('scorebug.score') }}</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">{{ t('scorebug.team') }}</th>
          <th scope="col">{{ t('scorebug.score') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="`${game.away.bgClass} ${game.away.textClass}`">
          <td class="py-2.5 pl-2 pr-2 sm:pr-4">{{ game.away.team }}</td>
          <td class="py-2.5 pl-2 pr-2 sm:pl-4 text-right">
            {{ game.away.score }}
          </td>
        </tr>

        <tr :class="`${game.home.bgClass} ${game.home.textClass}`">
          <td class="py-2.5 pl-2 pr-2 sm:pr-4">{{ game.home.team }}</td>
          <td class="py-2.5 pl-2 pr-2  sm:pl-4 text-right">
            {{ game.home.score }}
          </td>
        </tr>

        <tr class="bg-gray-900">
          <td class="py-2.5 pl-0 pr-2 sm:pr-4" v-if="game.inProgress">
            <span class="flex items-center justify-start w-full">
              <Chevron :isUp="game.isTop"/>
              <span>{{ game.inning }}</span>
            </span>
          </td>
          <td class="py-2.5" v-else>{{ t(`status.${game.statusCode}`) }}</td>
          <td class="text-right py-2.5 pl-2 sm:pl-4">{{ game.isPregame ? dateFormat(game.gameTime, 'hh:mm a') : game.batterCount }}</td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="game.inProgress"
      class="flex flex-col justify-center w-28 items-center bg-gray-900"
      @click="goToBoxscore()"
    >
      <div class="flex-grow w-28 relative">
        <div class="w-16 h-16 flex flex-wrap transform rotate-45 translate-x-6 translate-y-6 absolute">
          <div
            v-for="base in [game.runners.find(b => b.num === 2), game.runners.find(b => b.num === 1), game.runners.find(b => b.num === 3)]"
            :key="base.num"
            :class="{ 'active': base.runner }"
            class="base"
          ></div>
          <svg class="transform -rotate-45 mt-3 ml-3" viewBox="189.848 157.915 17 17.119" width="17" height="17.119">
            <path d="M 206.503 166.512 L 197.953 175.012 M 189.848 157.915 L 206.848 157.915 M 190.348 158.399 L 190.348 166.899 M 206.36 158.399 L 206.36 166.899 M 190.203 166.512 L 198.633 175.034" style="paint-order: fill; fill: white; stroke: black;"></path>
            <polygon style="stroke: white; fill: white;" points="198.283 173.812 190.966 166.441 190.966 158.512 205.766 158.512 205.832 166.458"></polygon>
          </svg>
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
      v-if="playerInfoExpanded && game.inProgress && game.home.currentPlayer && game.away.currentPlayer"
      class="table-auto w-full text-gray-100 rounded"
      @click="goToBoxscore()"
    >
      <caption class="sr-only">{{ t('scorebug.currentPlayers') }}</caption>
      <thead class="sr-only">
        <tr>
          <th scope="col">{{ t('scorebug.player') }}</th>
          <th scope="col">{{ t('scorebug.stat') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="`${game.away.bgClass} ${game.away.textClass}`">
          <td class="py-2.5 text-right">{{ game.isTop ? `${game.away.order} ${game.away.currentPlayer.person.fullName}` : game.away.currentPlayer.person.fullName }}</td>
          <td class="py-2.5 text-right">{{ game.isTop ? t('scorebug.batterStats', { hits: game.away.currentPlayer.stats.batting.hits, atBats: game.away.currentPlayer.stats.batting.atBats }) : `${game.away.currentPlayer.stats.pitching.pitchesThrown}P` }}</td>
        </tr>
        <tr :class="`${game.home.bgClass} ${game.home.textClass}`">
          <td class="py-2.5 text-right">{{ game.isTop ? game.home.currentPlayer.person.fullName : `${game.home.order} ${game.home.currentPlayer.person.fullName}` }}</td>
          <td class="py-2.5 text-right">{{ game.isTop ? `${game.home.currentPlayer.stats.pitching.pitchesThrown}P` : t('scorebug.batterStats', { hits: game.home.currentPlayer.stats.batting.hits, atBats: game.home.currentPlayer.stats.batting.atBats }) }}</td>
        </tr>
        <tr class="bg-gray-900">
          <td class="py-5.5"></td>
          <td class="py-5.5"></td>
        </tr>
      </tbody>
    </table>
    <div v-if="game.inProgress" class="text-gray-100 bg-gray-900 pt-2 pr-1 pl-1">
      <div class="cursor-pointer" @click="togglePlayerInfoExpanded">
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
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ref, toRefs } from 'vue'

import Chevron from '@/components/Chevron'
import useDateFormat from '@/composables/useDateFormat'

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
  components: {
    Chevron
  },
  setup(props) {
    const router = useRouter()
    const { game } = toRefs(props)
    const { t } = useI18n()

    const playerInfoExpanded = ref(false)

    const togglePlayerInfoExpanded = () => (playerInfoExpanded.value = !playerInfoExpanded.value)

    const goToBoxscore = () => router.push(`/game/${game.value.gamePk}`)

    const { dateFormat } = useDateFormat()

    return {
      t,
      dateFormat,
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

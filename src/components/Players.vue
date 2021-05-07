<template>
  <div class="flex flex-row flex-wrap items-center justify-start md:items-start md:justify-center">
    <div class="m-2 flex flex-col items-center">
      <BattersTable
        v-if="game"
        :batters="awayBatters"
        :bgClass="game.away.bgClass"
        :textClass="game.away.textClass"
      >
        <template v-slot:header>
          <h4 class="font-bold text-lg text-center bg-gray-900 w-full p-2">{{ t('playerTable.battersTitle', { team: game.away.name }) }}</h4>
        </template>
        <template v-slot:caption>
          <caption class="sr-only">{{ t('playerTable.awayBatters') }}</caption>
        </template>
      </BattersTable>
      <div class="inline-block">
        <PitchersTable
          v-if="game"
          :pitchers="awayPitchers"
          :bgClass="game.away.bgClass"
          :textClass="game.away.textClass"
        >
          <template v-slot:header>
            <h4 class="font-bold text-lg text-center bg-gray-900 w-full p-2">{{ t('playerTable.pitchersTitle', { team: game.away.name }) }}</h4>
          </template>
          <template v-slot:caption>
            <caption class="sr-only">{{ t('playerTable.awayPitchers') }}</caption>
          </template>
        </PitchersTable>
      </div>
    </div>
    <div class="m-2 flex flex-col items-center">
      <BattersTable
        v-if="game"
        :batters="homeBatters"
        :bgClass="game.home.bgClass"
        :textClass="game.home.textClass"
      >
        <template v-slot:header>
          <h4 class="font-bold text-lg text-center bg-gray-900 w-full p-2">{{ t('playerTable.battersTitle', { team: game.home.name }) }}</h4>
        </template>
        <template v-slot:caption>
          <caption class="sr-only">{{ t('playerTable.homeBatters') }}</caption>
        </template>
      </BattersTable>
      <div class="inline-block">
        <PitchersTable
          v-if="game"
          :pitchers="homePitchers"
          :bgClass="game.home.bgClass"
          :textClass="game.home.textClass"
        >
          <template v-slot:header>
            <h4 class="font-bold text-lg text-center bg-gray-900 w-full p-2">{{ t('playerTable.pitchersTitle', { team: game.home.name }) }}</h4>
          </template>
          <template v-slot:caption>
            <caption class="sr-only">{{ t('playerTable.homePitchers') }}</caption>
          </template>
        </PitchersTable>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'

import BattersTable from '@/components/BattersTable'
import PitchersTable from '@/components/PitchersTable'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Players',
  props: {
    gamePk: {
      type: String,
      required: true
    }
  },
  components: {
    BattersTable,
    PitchersTable
  },
  setup(props) {
    const { gamePk } = toRefs(props)
    const store = useStore()
    const { t } = useI18n()

    const game = computed(() => store.getters.getGame(gamePk.value))

    const homeBatters = computed(() => store.getters.getTeamBattersForGame(gamePk.value, 'home'))
    const awayBatters = computed(() => store.getters.getTeamBattersForGame(gamePk.value, 'away'))

    const homePitchers = computed(() => store.getters.getTeamPitchersForGame(gamePk.value, 'home'))
    const awayPitchers = computed(() => store.getters.getTeamPitchersForGame(gamePk.value, 'away'))

    return {
      t,
      game,
      homeBatters,
      awayBatters,
      homePitchers,
      awayPitchers
    }
  }
}
</script>

<style scoped>
.players-table {
  @apply border-collapse border border-white border-opacity-50;
}

.players-table th,
.players-table td {
  @apply pr-3 pl-3;
}

.players-table td {
  @apply border-l border-r border-white border-opacity-60;
}

.players-table th {
  @apply border-b border-white border-opacity-60;
}
</style>

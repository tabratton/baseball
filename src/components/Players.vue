<template>
  <div class="flex flex-row items-start justify-center">
    <div class="m-2">
      <BattersTable
        v-if="game"
        :batters="awayBatters"
        :bgClass="game.away.bgClass"
        :textClass="game.away.textClass"
      >
        <template v-slot:header>
          <h4 class="font-bold text-lg text-center">{{ game.away.name }} - Batters</h4>
        </template>
        <template v-slot:caption>
          <caption class="sr-only">Away Batters</caption>
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
            <h4 class="font-bold text-lg text-center">{{ game.away.name }} - Pitchers</h4>
          </template>
          <template v-slot:caption>
            <caption class="sr-only">Away Pitchers</caption>
          </template>
        </PitchersTable>
      </div>
    </div>
    <div class="m-2">
      <BattersTable
        v-if="game"
        :batters="homeBatters"
        :bgClass="game.home.bgClass"
        :textClass="game.home.textClass"
      >
        <template v-slot:header>
          <h4 class="font-bold text-lg text-center">{{ game.home.name }} - Batters</h4>
        </template>
        <template v-slot:caption>
          <caption class="sr-only">Home Batters</caption>
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
            <h4 class="font-bold text-lg text-center">{{ game.home.name }} - Pitchers</h4>
          </template>
          <template v-slot:caption>
            <caption class="sr-only">Home Pitchers</caption>
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

    const game = computed(() => store.getters.getGame(gamePk.value))

    const homeBatters = computed(() => store.getters.getTeamBattersForGame(gamePk.value, 'home'))
    const awayBatters = computed(() => store.getters.getTeamBattersForGame(gamePk.value, 'away'))

    const homePitchers = computed(() => store.getters.getTeamPitchersForGame(gamePk.value, 'home'))
    const awayPitchers = computed(() => store.getters.getTeamPitchersForGame(gamePk.value, 'away'))

    return {
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

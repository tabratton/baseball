<template>
  <div class="standings h-home w-screen p-4 overflow-auto">
    <div class="bg-gray-800 rounded-md p-4 my-4 w-full" v-if="americanStandings">
      <div class="text-center text-2xl font-bold mb-2">{{ t('standings.american.title') }}</div>
      <div class="division-container">
        <div v-for="division in americanStandings" :key="division.division.id" class="p-2 w-full flex-auto">
          <div class="text-center font-bold cursor-pointer" @click="updateAL(division.division.id)">
            {{ t(`standings.american.${division.division.abbreviation}`) }}
          </div>
          <SortableTable
            :items="division.teamRecords"
            :headers="headers"
            :sortField="americanField"
            :sortDirection="americanDirection"
            bgClass="bg-gray-800"
            textClass="text-white"
            class="w-full"
            @update-sort="americanUpdate"
          >
            <template v-slot:header="slotProps">
              <span>{{ slotProps.header.label }}</span>
            </template>
            <template v-slot:rows="slotProps">
              <tr v-for="record in slotProps.sortedItems" :key="record.team.short">
                <td>{{ record.divisionRank }}</td>
                <td class="flex items-center justify-center">
                  <img class="h-6 mr-2" :src="`/assets/team_logos/${record.team.short.toLowerCase()}.png`">
                  <abbr :title="record.team.name">
                    {{ record.team.short }}
                  </abbr>
                </td>
                <td>{{ record.leagueRecord.wins }}</td>
                <td>{{ record.leagueRecord.losses }}</td>
                <td>{{ record.leagueRecord.pct }}</td>
                <td>{{ record.gamesBack }}</td>
                <td>{{ record.wildCardGamesBack }}</td>
                <td>{{ record.runsScored }}</td>
                <td>{{ record.runsAllowed }}</td>
                <td>{{ record.runDifferential }}</td>
              </tr>
            </template>
          </SortableTable>
        </div>
      </div>
      <DiffChart :diffs="alFilteredDiffs" v-if="alDivision"></DiffChart>
    </div>
    <div class="bg-gray-800 rounded-md p-4 my-4 w-full" v-if="nationalStandings">
      <div class="text-center text-2xl font-bold mb-2">{{ t('standings.national.title') }}</div>
      <div class="division-container">
        <div v-for="division in nationalStandings" :key="division.division.id" class="p-2 w-full flex-auto">
          <div class="text-center font-bold cursor-pointer"  @click="updateNL(division.division.id)">
            {{ t(`standings.national.${division.division.abbreviation}`) }}
          </div>
          <SortableTable
              :items="division.teamRecords"
              :headers="headers"
              :sortField="nationalField"
              :sortDirection="nationalDirection"
              bgClass="bg-gray-800"
              textClass="text-white"
              class="w-full"
              @update-sort="nationalUpdate"
          >
            <template v-slot:header="slotProps">
              <span>{{ slotProps.header.label }}</span>
            </template>
            <template v-slot:rows="slotProps">
              <tr v-for="record in slotProps.sortedItems" :key="record.team.short">
                <td>{{ record.divisionRank }}</td>
                <td class="flex items-center justify-center">
                  <img class="h-6 mr-2" :src="`/assets/team_logos/${record.team.short.toLowerCase()}.png`">
                  <abbr :title="record.team.name">
                    {{ record.team.short }}
                  </abbr>
                </td>
                <td>{{ record.leagueRecord.wins }}</td>
                <td>{{ record.leagueRecord.losses }}</td>
                <td>{{ record.leagueRecord.pct }}</td>
                <td>{{ record.gamesBack }}</td>
                <td>{{ record.wildCardGamesBack }}</td>
                <td>{{ record.runsScored }}</td>
                <td>{{ record.runsAllowed }}</td>
                <td>{{ record.runDifferential }}</td>
              </tr>
            </template>
          </SortableTable>
        </div>
      </div>
      <DiffChart :diffs="nlFilteredDiffs" v-if="nlDivision"></DiffChart>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import SortableTable from '@/components/SortableTable'
import useSortableTable from '@/composables/useSortableTable'
import DiffChart from '@/components/DiffChart'

export default {
  name: 'Standings',
  components: {
    SortableTable,
    DiffChart
  },
  setup() {
    const store = useStore()
    const { t } = useI18n()

    store.dispatch('fetchStandings')
    store.dispatch('fetchWinDifferentials')

    const standings = computed(() => store.getters.getStandings)
    const americanStandings = computed(() => standings.value.american)
    const nationalStandings = computed(() => standings.value.national)

    const alDivision = ref(null)
    const nlDivision = ref(null)

    const winDiffs = computed(() => store.getters.getDiffs)
    const alFilteredDiffs = computed(() => winDiffs.value.filter(team => team.divisionId === alDivision.value))
    const nlFilteredDiffs = computed(() => winDiffs.value.filter(team => team.divisionId === nlDivision.value))

    const { sortField: americanField, sortDirection: americanDirection, update: americanUpdate } = useSortableTable(americanStandings, 'divisionRank', 'asc')
    const { sortField: nationalField, sortDirection: nationalDirection, update: nationalUpdate } = useSortableTable(nationalStandings, 'divisionRank', 'asc')

    const headers = computed(() => [
      { label: '#', field: 'divisionRank' },
      { label: 'Team', field: 'team.name' },
      { label: 'W', field: 'leagueRecord.wins' },
      { label: 'L', field: 'leagueRecord.losses' },
      { label: '%', field: 'leagueRecord.pct' },
      { label: 'GB', field: 'gamesBack' },
      { label: 'WC', field: 'wildCardGamesBack' },
      { label: 'RS', field: 'runsScored' },
      { label: 'RA', field: 'runsAllowed' },
      { label: 'Δ', field: 'runDifferential' }
    ])

    const updateAL = id => {
      if (alDivision.value === id) {
        alDivision.value = null
      } else {
        alDivision.value = null
        alDivision.value = id
      }
    }

    const updateNL = id => {
      if (nlDivision.value === id) {
        nlDivision.value = null
      } else {
        alDivision.value = null
        nlDivision.value = id
      }
    }

    return {
      t,
      americanStandings,
      nationalStandings,
      headers,
      americanField,
      americanDirection,
      americanUpdate,
      nationalField,
      nationalDirection,
      nationalUpdate,
      alDivision,
      alFilteredDiffs,
      updateAL,
      nlDivision,
      nlFilteredDiffs,
      updateNL
    }
  }
}
</script>

<style scoped>
table tbody tr:nth-child(odd) {
  @apply bg-gray-700;
}

abbr[title] {
  @apply no-underline border-b-2 border-dotted border-white;
}

.division-container {
  @apply overflow-y-auto flex flex-col 2xl:flex-row items-center;
}
</style>

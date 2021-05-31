<template>
  <div class="standings h-home w-screen overflow-y-auto">
    <div class="w-full flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div class="bg-gray-800 rounded-md p-4 m-2" v-if="americanStandings">
        <div class="text-center text-2xl font-bold">{{ t('standings.american.title') }}</div>
        <div class="flex flex-row">
          <div v-for="division in americanStandings" :key="division.division.id" class="m-2">
            <div class="text-center font-bold">{{ t(`standings.american.${division.division.abbreviation}`) }}</div>
            <SortableTable
              :items="division.teamRecords"
              :headers="headers"
              :sortField="americanField"
              :sortDirection="americanDirection"
              bgClass="bg-gray-800"
              textClass="text-white"
              @update-sort="americanUpdate"
            >
              <template v-slot:header="slotProps">
                <span>{{ slotProps.header.label }}</span>
              </template>
              <template v-slot:rows="slotProps">
                <tr v-for="record in slotProps.sortedItems" :key="record.team.name">
                  <td>{{ record.divisionRank }}</td>
                  <td>{{ record.team.name }}</td>
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
      </div>
      <div class="bg-gray-800 rounded-md p-4 m-2" v-if="nationalStandings">
        <div class="text-center text-2xl font-bold">{{ t('standings.national.title') }}</div>
        <div class="flex flex-row">
          <div v-for="division in nationalStandings" :key="division.division.id" class="m-2">
            <div class="text-center font-bold">{{ t(`standings.national.${division.division.abbreviation}`) }}</div>
            <SortableTable
                :items="division.teamRecords"
                :headers="headers"
                :sortField="nationalField"
                :sortDirection="nationalDirection"
                bgClass="bg-gray-800"
                textClass="text-white"
                @update-sort="nationalUpdate"
            >
              <template v-slot:header="slotProps">
                <span>{{ slotProps.header.label }}</span>
              </template>
              <template v-slot:rows="slotProps">
                <tr v-for="record in slotProps.sortedItems" :key="record.team.name">
                  <td>{{ record.divisionRank }}</td>
                  <td>{{ record.team.name }}</td>
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
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import SortableTable from '@/components/SortableTable'
import useSortableTable from '@/composables/useSortableTable'

export default {
  name: 'Standings',
  components: {
    SortableTable
  },
  setup() {
    const store = useStore()
    const { t } = useI18n()

    store.dispatch('fetchStandings')

    const standings = computed(() => store.getters.getStandings)
    const americanStandings = computed(() => standings.value.american)
    const nationalStandings = computed(() => standings.value.national)

    const { sortField: americanField, sortDirection: americanDirection, update: americanUpdate } = useSortableTable(americanStandings, 'divisionRank', 'asc')
    const { sortField: nationalField, sortDirection: nationalDirection, update: nationalUpdate } = useSortableTable(nationalStandings, 'divisionRank', 'asc')

    const headers = computed(() => [
      { label: 'Rank', field: 'divisionRank' },
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
      nationalUpdate
    }
  }
}
</script>

<style scoped>
table tbody tr:nth-child(odd) {
  @apply bg-gray-700;
}
</style>

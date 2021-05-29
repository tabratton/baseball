<template>
  <slot name="header"></slot>
  <SortableTable
    :items="batters"
    :headers="headers"
    :sortField="sortField"
    :sortDirection="sortDirection"
    :bgClass="bgClass"
    :textClass="textClass"
    @update-sort="update"
    class="players-table"
  >
    <template v-slot:header="slotProps">
      <span>{{ slotProps.header.label }}</span>
    </template>
    <template v-slot:rows="slotProps">
      <tr v-for="player in slotProps.sortedItems" :key="player.jerseyNumber">
        <td>{{ Number.isInteger(Number(player.battingOrder) / 100) ? `${Number(player.battingOrder) / 100}.` : '' }}</td>
        <td>{{ player.position.abbreviation }}</td>
        <td>
          <router-link :to="{ name: 'Player', params: { playerId: player.person.id }}">
            {{ player.person.fullName }}
          </router-link>
        </td>
        <td class="hidden lg:table-cell">{{ player.jerseyNumber }}</td>
        <td>{{ player.stats.batting.atBats }}</td>
        <td>{{ player.stats.batting.hits }}</td>
        <td>{{ player.stats.batting.runs }}</td>
        <td>{{ player.stats.batting.baseOnBalls }}</td>
        <td>{{ player.stats.batting.rbi }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.batting.singles }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.batting.doubles }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.batting.triples }}</td>
        <td>{{ player.stats.batting.homeRuns }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.batting.hitByPitch }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.batting.avg }}</td>
      </tr>
    </template>
  </SortableTable>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import SortableTable from '@/components/SortableTable'
import useSortableTable from '@/composables/useSortableTable'

export default {
  name: 'BattersTable',
  props: {
    batters: {
      type: Array,
      required: true
    },
    bgClass: {
      type: String,
      required: true
    },
    textClass: {
      type: String,
      required: true
    }
  },
  components: {
    SortableTable
  },
  setup(props) {
    const { batters } = toRefs(props)
    const { t } = useI18n()

    const { sortField, sortDirection, update } = useSortableTable(batters, 'battingOrder', 'asc')

    const headers = computed(() => [
      { label: '', field: 'battingOrder' },
      { label: 'POS', field: 'position.abbreviation' },
      { label: t('playerTable.name'), field: 'person.fullName' },
      { label: '#', field: 'jerseyNumber', class: 'hidden lg:table-cell' },
      { label: 'AB', field: 'stats.batting.atBats' },
      { label: 'H', field: 'stats.batting.hits' },
      { label: 'R', field: 'stats.batting.runs' },
      { label: 'BB', field: 'stats.batting.baseOnBalls' },
      { label: 'RBI', field: 'stats.batting.rbi' },
      { label: '1B', field: 'stats.batting.singles', class: 'hidden lg:table-cell' },
      { label: '2B', field: 'stats.batting.doubles', class: 'hidden lg:table-cell' },
      { label: '3B', field: 'stats.batting.triples', class: 'hidden lg:table-cell' },
      { label: 'HR', field: 'stats.batting.homeRuns' },
      { label: 'HBP', field: 'stats.batting.hitByPitch', class: 'hidden lg:table-cell' },
      { label: 'AVG', field: 'stats.batting.avg', class: 'hidden lg:table-cell' }
    ])

    return {
      sortField,
      sortDirection,
      update,
      headers
    }
  }
}
</script>

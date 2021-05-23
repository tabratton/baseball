<template>
  <slot name="header"></slot>
  <SortableTable
    :items="batters"
    :headers="batterHeaders"
    :sortField="sortField"
    :sortDirection="sortDirection"
    :valueGetter="valueGetter"
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
import { toRefs } from 'vue'
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

    const valueGetter = (a, b, sf) => {
      let valueA = null
      let valueB = null

      switch (sf) {
        case 'battingOrder':
          valueA = a.battingOrder
          valueB = b.battingOrder
          break
        case 'position.abbreviation':
          valueA = a.position.abbreviation
          valueB = b.position.abbreviation
          break
        case 'person.fullName':
          valueA = a.person.fullName
          valueB = b.person.fullName
          break
        case 'jerseyNumber':
          valueA = Number(a.jerseyNumber)
          valueB = Number(b.jerseyNumber)
          break
        case 'stats.batting.atBats':
          valueA = Number(a.stats.batting.atBats)
          valueB = Number(b.stats.batting.atBats)
          break
        case 'stats.batting.hits':
          valueA = Number(a.stats.batting.hits)
          valueB = Number(b.stats.batting.hits)
          break
        case 'stats.batting.runs':
          valueA = Number(a.stats.batting.runs)
          valueB = Number(b.stats.batting.runs)
          break
        case 'stats.batting.baseOnBalls':
          valueA = Number(a.stats.batting.baseOnBalls)
          valueB = Number(b.stats.batting.baseOnBalls)
          break
        case 'stats.batting.rbi':
          valueA = Number(a.stats.batting.rbi)
          valueB = Number(b.stats.batting.rbi)
          break
        case 'stats.batting.singles':
          valueA = Number(a.stats.batting.singles)
          valueB = Number(b.stats.batting.singles)
          break
        case 'stats.batting.doubles':
          valueA = Number(a.stats.batting.doubles)
          valueB = Number(b.stats.batting.doubles)
          break
        case 'stats.batting.triples':
          valueA = Number(a.stats.batting.triples)
          valueB = Number(b.stats.batting.triples)
          break
        case 'stats.batting.homeRuns':
          valueA = Number(a.stats.batting.homeRuns)
          valueB = Number(b.stats.batting.homeRuns)
          break
        case 'stats.batting.hitByPitch':
          valueA = Number(a.stats.batting.hitByPitch)
          valueB = Number(b.stats.batting.hitByPitch)
          break
        case 'stats.batting.avg':
          valueA = Number(a.stats.batting.avg)
          valueB = Number(b.stats.batting.avg)
          break
      }

      return { valueA, valueB }
    }

    return {
      sortField,
      sortDirection,
      valueGetter,
      update,
      batterHeaders: [
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
      ]
    }
  }
}
</script>

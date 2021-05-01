<template>
  <slot name="header"></slot>
  <table :class="{ [bgClass]: true, [textClass]: true }" class="players-table table-auto text-center mb-4">
    <slot name="caption"></slot>
    <thead>
      <tr>
        <th
          class="cursor-pointer"
          scope="col"
          v-for="header in batterHeaders"
          :key="header.field"
          @click="sort(header.field)"
        >
          <span>{{ header.label }}</span>
          <Chevron v-if="sortField === header.field" class="inline" :isUp="sortDirection === 'asc'"/>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in sortedPlayers" :key="player.jerseyNumber">
        <td>{{ Number.isInteger(Number(player.battingOrder) / 100) ? `${Number(player.battingOrder) / 100}.` : '' }}</td>
        <td>{{ player.position.abbreviation }}</td>
        <td>{{ player.person.fullName }}</td>
        <td>{{ player.jerseyNumber }}</td>
        <td>{{ player.stats.batting.atBats }}</td>
        <td>{{ player.stats.batting.hits }}</td>
        <td>{{ player.stats.batting.runs }}</td>
        <td>{{ player.stats.batting.baseOnBalls }}</td>
        <td>{{ player.stats.batting.rbi }}</td>
        <td>{{ player.stats.batting.singles }}</td>
        <td>{{ player.stats.batting.doubles }}</td>
        <td>{{ player.stats.batting.triples }}</td>
        <td>{{ player.stats.batting.homeRuns }}</td>
        <td>{{ player.stats.batting.hitByPitch }}</td>
        <td>{{ player.stats.batting.avg }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, ref, toRefs } from 'vue'

import Chevron from '@/components/Chevron'

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
    Chevron
  },
  setup(props) {
    const { batters } = toRefs(props)

    const sortField = ref('battingOrder')
    const sortDirection = ref('asc')

    const sortedPlayers = computed(() => [...batters.value].sort((a, b) => {
      let modifier = 1;
      if (sortDirection.value === 'desc') {
        modifier = -1;
      }

      let valueA = null
      let valueB = null

      switch (sortField.value) {
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

      if (valueA < valueB){
        return -1 * modifier;
      }

      if (valueA > valueB) {
        return modifier;
      }

      return 0;
    }))

    const sort = field => {
      if (field === sortField.value) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      }

      sortField.value = field
    }

    return {
      sort,
      sortedPlayers,
      sortField,
      sortDirection,
      batterHeaders: [
        { label: '', field: 'battingOrder' },
        { label: 'POS', field: 'position.abbreviation' },
        { label: 'Name', field: 'person.fullName' },
        { label: '#', field: 'jerseyNumber' },
        { label: 'AB', field: 'stats.batting.atBats' },
        { label: 'H', field: 'stats.batting.hits' },
        { label: 'R', field: 'stats.batting.runs' },
        { label: 'BB', field: 'stats.batting.baseOnBalls' },
        { label: 'RBI', field: 'stats.batting.rbi' },
        { label: '1B', field: 'stats.batting.singles' },
        { label: '2B', field: 'stats.batting.doubles' },
        { label: '3B', field: 'stats.batting.triples' },
        { label: 'HR', field: 'stats.batting.homeRuns' },
        { label: 'HBP', field: 'stats.batting.hitByPitch' },
        { label: 'AVG', field: 'stats.batting.avg' }
      ]
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

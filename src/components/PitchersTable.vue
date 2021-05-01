<template>
  <slot name="header"></slot>
  <table :class="{ [bgClass]: true, [textClass]: true }" class="players-table table-auto text-center text-white">
    <slot name="caption"></slot>
    <thead>
      <tr>
        <th
          class="cursor-pointer"
          scope="col"
          v-for="header in pitcherHeaders"
          :key="header"
          @click="sort(header.field)"
        >
          {{ header.label }}
          <Chevron v-if="sortField === header.field" class="inline" :isUp="sortDirection === 'asc'"/>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in sortedPlayers" :key="player.jerseyNumber">
        <td>{{ player.index }}</td>
        <td>{{ player.person.fullName }}</td>
        <td>{{ player.jerseyNumber }}</td>
        <td>{{ player.stats.pitching.inningsPitched }}</td>
        <td>{{ player.stats.pitching.hits }}</td>
        <td>{{ player.stats.pitching.earnedRuns }}</td>
        <td>{{ player.stats.pitching.strikeOuts }}</td>
        <td>{{ player.stats.pitching.baseOnBalls }}</td>
        <td>{{ player.stats.pitching.balls }}/{{ player.stats.pitching.strikes }}</td>
        <td>{{ player.stats.pitching.era }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, ref, toRefs } from 'vue'

import Chevron from '@/components/Chevron'

export default {
  name: 'PitchersTable',
  props: {
    pitchers: {
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
    const { pitchers } = toRefs(props)

    const sortField = ref('index')
    const sortDirection = ref('asc')

    const sortedPlayers = computed(() => [...pitchers.value].sort((a, b) => {
      let modifier = 1;
      if (sortDirection.value === 'desc') {
        modifier = -1;
      }

      let valueA = null
      let valueB = null

      switch (sortField.value) {
        case 'index':
          valueA = a.index
          valueB = b.index
          break
        case 'person.fullName':
          valueA = a.person.fullName
          valueB = b.person.fullName
          break
        case 'jerseyNumber':
          valueA = a.jerseyNumber
          valueB = b.jerseyNumber
          break
        case 'stats.pitching.inningsPitched':
          valueA = a.stats.pitching.inningsPitched
          valueB = b.stats.pitching.inningsPitched
          break
        case 'stats.pitching.hits':
          valueA = Number(a.stats.pitching.hits)
          valueB = Number(b.stats.pitching.hits)
          break
        case 'stats.pitching.earnedRuns':
          valueA = Number(a.stats.pitching.earnedRuns)
          valueB = Number(b.stats.pitching.earnedRuns)
          break
        case 'stats.pitching.strikeOuts':
          valueA = Number(a.stats.pitching.strikeOuts)
          valueB = Number(b.stats.pitching.strikeOuts)
          break
        case 'stats.pitching.baseOnBalls':
          valueA = Number(a.stats.pitching.baseOnBalls)
          valueB = Number(b.stats.pitching.baseOnBalls)
          break
        case 'stats.pitching.ballsAndStrikes':
          valueA = Number(a.stats.pitching.ballsAndStrikes)
          valueB = Number(b.stats.pitching.ballsAndStrikes)
          break
        case 'stats.pitching.era':
          valueA = Number(a.stats.pitching.era)
          valueB = Number(b.stats.pitching.era)
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
      pitcherHeaders: [
        { label: '', field: 'index' },
        { label: 'Name', field: 'person.fullName' },
        { label: '#', field: 'jerseyNumber' },
        { label: 'IP', field: 'stats.pitching.inningsPitched' },
        { label: 'H', field: 'stats.pitching.hits' },
        { label: 'ER', field: 'stats.pitching.earnedRuns' },
        { label: 'K', field: 'stats.pitching.strikeOuts' },
        { label: 'BB', field: 'stats.pitching.baseOnBalls' },
        { label: 'B/S', field: 'stats.pitching.ballsAndStrikes' },
        { label: 'ERA', field: 'stats.pitching.era' }
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

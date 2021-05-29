<template>
  <slot name="header"></slot>
  <SortableTable
    :items="pitchers"
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
        <td>{{ player.index }}</td>
        <td>
          <router-link :to="{ name: 'Player', params: { playerId: player.person.id }}">
            {{ player.person.fullName }}
          </router-link>
        </td>
        <td class="hidden lg:table-cell">{{ player.jerseyNumber }}</td>
        <td>{{ player.stats.pitching.inningsPitched }}</td>
        <td>{{ player.stats.pitching.hits }}</td>
        <td>{{ player.stats.pitching.earnedRuns }}</td>
        <td>{{ player.stats.pitching.strikeOuts }}</td>
        <td>{{ player.stats.pitching.baseOnBalls }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.pitching.balls }}/{{ player.stats.pitching.strikes }}</td>
        <td class="hidden lg:table-cell">{{ player.stats.pitching.era }}</td>
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
    SortableTable
  },
  setup(props) {
    const { pitchers } = toRefs(props)
    const { t } = useI18n()

    const { sortField, sortDirection, update } = useSortableTable(pitchers, 'index', 'asc')

    const headers = computed(() => [
      { label: '', field: 'index' },
      { label: t('playerTable.name'), field: 'person.fullName' },
      { label: '#', field: 'jerseyNumber', class: 'hidden lg:table-cell' },
      { label: 'IP', field: 'stats.pitching.inningsPitched' },
      { label: 'H', field: 'stats.pitching.hits' },
      { label: 'ER', field: 'stats.pitching.earnedRuns' },
      { label: 'K', field: 'stats.pitching.strikeOuts' },
      { label: 'BB', field: 'stats.pitching.baseOnBalls' },
      { label: 'B/S', field: 'stats.pitching.ballsAndStrikes', class: 'hidden lg:table-cell' },
      { label: 'ERA', field: 'stats.pitching.era', class: 'hidden lg:table-cell' }
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

<template>
  <slot name="header"></slot>
  <SortableTable
    :items="pitchers"
    :headers="pitcherHeaders"
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
import { ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import SortableTable from '@/components/SortableTable'
import useSortableTable from '@/composables/useSortableTable'
import useTranslationsInSetup from '@/composables/useTranslationsInSetup'

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

    const valueGetter = (a, b, sf) => {
      let valueA = null
      let valueB = null

      switch (sf) {
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

      return { valueA, valueB }
    }

    const pitcherHeaders = ref([])
    const setPitcherHeaders = () => {
      pitcherHeaders.value = [
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
      ]
    }

    const { watchFunc } = useTranslationsInSetup()
    watchFunc(setPitcherHeaders)

    return {
      sortField,
      sortDirection,
      valueGetter,
      update,
      pitcherHeaders
    }
  }
}
</script>

<template>
  <div class="player h-home w-screen overflow-y-auto">
    <div class="w-full flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div v-if="player && player.id" class="bg-gray-800 rounded-md m-4 w-full xl:w-3/4">
        <div class="w-full pt-6 pl-6 font-bold text-2xl">{{ player.fullName }} - #{{ player.primaryNumber }}</div>
        <div class="w-full pl-6 italic text-md" v-if="player.nickName">{{ t('player.playerInfo.nickname', { nickname: player.nickName }) }}</div>
        <div class="flex flex-row">
          <div class="flex flex-col p-6">
            <span v-if="player.batSide.code">
              {{ t('player.playerInfo.bats', { bats: player.batSide.code }) }}
            </span>
            <span v-if="player.pitchHand.code">
              {{ t('player.playerInfo.throws', { throws: player.pitchHand.code }) }}
            </span>
            <span v-if="player.height">
              {{ t('player.playerInfo.height', { height: player.height }) }}
            </span>
            <span v-if="player.weight">
              {{ t('player.playerInfo.weight', { weight: player.weight }) }}
            </span>
          </div>
          <div class="flex flex-col p-6">
            <span v-if="player.currentAge">
              {{ t('player.playerInfo.age', { age: player.currentAge }) }}
            </span>
            <span v-if="player.birthDate">
              {{ t('player.playerInfo.birthday', { birthday: dateFormat(dateParse(player.birthDate)) }) }}
            </span>
            <span v-if="player.birthCity || player.birthStateProvince || player.birthCountry">
              {{ t('player.playerInfo.birthplace', { birthplace: [player.birthCity, player.birthStateProvince, player.birthCountry].filter(v => v).join(', ') }) }}
            </span>
            <span v-if="player.draftYear">
              {{ t('player.playerInfo.drafted', { drafted: player.draftYear }) }}
            </span>
            <span v-if="player.mlbDebutDate">
              {{ t('player.playerInfo.debut', { debut: dateFormat(dateParse(player.mlbDebutDate)) }) }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <span v-if="pitchingExists">
            <input
                class="m-4"
                type="radio"
                id="pitching"
                name="statType"
                value="pitching"
                v-model="selectedStatType"
            >
            <label for="pitching">{{ t('player.stats.pitching') }}</label>
          </span>

          <span v-if="hittingExists">
            <input
                class="m-4"
                type="radio"
                id="hitting"
                name="statType"
                value="hitting"
                v-model="selectedStatType"
            >
            <label for="hitting">{{ t('player.stats.hitting') }}</label>
          </span>

          <span v-if="fieldingExists">
            <input
                class="m-4"
                type="radio"
                id="fielding"
                name="statType"
                value="fielding"
                v-model="selectedStatType"
            >
            <label for="fielding">{{ t('player.stats.fielding') }}</label>
          </span>
        </div>
      </div>
      <div v-if="player && player.id" class="bg-gray-800 rounded-md m-4 w-full xl:w-3/4">
        <div class="w-full pl-6 pt-6 font-bold text-3xl text-center">{{ seasonStats.season }}</div>
        <div class="w-full pt-6 pb-6 flex flex-row flex-wrap justify-center">
          <div v-for="stat in nonYearTypes" :key="stat.field" class="flex flex-col items-center m-3">
            <span class="font-bold">{{ stat.label }}</span>
            <span class="text-4xl font-bold">{{ stat.field.split('.').reduce((obj, key) => obj[key], seasonStats) }}</span>
          </div>
        </div>
      </div>
      <div v-if="player && player.id" class="bg-gray-800 rounded-md m-4 w-full xl:w-3/4">
        <div class="overflow-x-auto m-4">
          <SortableTable
              :items="yearByYearStats"
              :headers="statTypes"
              :sortField="sortField"
              :sortDirection="sortDirection"
              @update-sort="update"
              bgClass="bg-gray-800"
              textClass="text-white"
              class="player-table w-full"
          >
            <template v-slot:header="slotProps">
              {{ slotProps.header.label }}
            </template>
            <template v-slot:rows="slotProps">
              <tr v-for="year in slotProps.sortedItems" :key="`${year.team?.id}_${year.season}_${year.position?.code}`">
                <td
                    :class="stat.field === 'season' ? 'season-col' : ''"
                    class="whitespace-nowrap"
                    v-for="(stat, index) in statTypes" :key="stat.field"
                >
                  {{ stat.field.split('.').reduce((obj, key) => obj[key], year) }}
                  <span v-if="selectedStatType === 'fielding' && index === 0"> - {{ year.position.abbreviation }}</span>
                  <span v-if="index === 0 && year.team">- {{ year.team.short }}</span>
                </td>
              </tr>
              <tr>
                <td class="season-col whitespace-nowrap">{{ t('player.stats.career') }}</td>
                <td v-for="stat in nonYearTypes" :key="stat.field">{{ stat.field.split('.').reduce((obj, key) => obj[key], careerStats) }}</td>
              </tr>
            </template>
          </SortableTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseISO } from 'date-fns'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import SortableTable from '@/components/SortableTable'
import useDateFormat from '@/composables/useDateFormat'
import useSortableTable from '@/composables/useSortableTable'

import teamMap from '@/util/teamMap'

export default {
  name: 'PlayerView',
  components: {
    SortableTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()
    store.dispatch('fetchPlayer', route.params.playerId)

    const selectedStatType = ref('fielding')

    const player = computed(() => store.getters.getPlayer(route.params.playerId))
    const seasonStats = computed(() => ((((player.value || {}).stats || []).find(s => s.type.displayName === 'season' && s.group.displayName === selectedStatType.value) || {}).splits || [])[0])
    const careerStats = computed(() => ((((player.value || {}).stats || []).find(s => s.type.displayName === 'career' && s.group.displayName === selectedStatType.value) || {}).splits || [])[0])
    const yearByYearStats = computed(() => {
      return (player.value?.stats || [])
          .find(s => s.type.displayName === 'yearByYear' && s.group.displayName === selectedStatType.value)
          ?.splits
          .map(season => {
            if (season.team) {
              season.team.short = teamMap.find(team => team.id === season.team.id).short
            }

            return season
          })
    })

    const pitchingExists = computed(() => player.value.stats.find(s => s.group.displayName === 'pitching'))
    const hittingExists = computed(() => player.value.stats.find(s => s.group.displayName === 'hitting'))
    const fieldingExists = computed(() => player.value.stats.find(s => s.group.displayName === 'fielding'))

    watch(player, () => {
      selectedStatType.value = (player.value.primaryPosition || {}).code === '1' ? 'pitching' : 'hitting'
    })

    const statTypes = computed(() => {
      let types
      if (selectedStatType.value === 'pitching') {
        types = [
          { label: t('player.stats.season'), field: 'season', class: 'sticky left-0 bg-gray-800' },
          { label: t('player.stats.wins'), field: 'stat.wins' },
          { label: t('player.stats.losses'), field: 'stat.losses' },
          { label: t('player.stats.winPercentage'), field: 'stat.winPercentage' },
          { label: t('player.stats.holds'), field: 'stat.holds' },
          { label: t('player.stats.saves'), field: 'stat.saves' },
          { label: t('player.stats.saveOpportunities'), field: 'stat.saveOpportunities' },
          { label: t('player.stats.gamesStarted'), field: 'stat.gamesStarted' },
          { label: t('player.stats.inningsPitched'), field: 'stat.inningsPitched' },
          { label: t('player.stats.strikeOuts'), field: 'stat.strikeOuts' },
          { label: t('player.stats.baseOnBalls'), field: 'stat.baseOnBalls' },
          { label: t('player.stats.intentionalWalks'), field: 'stat.intentionalWalks' },
          { label: t('player.stats.hitByPitch'), field: 'stat.hitByPitch' },
          { label: t('player.stats.era'), field: 'stat.era' },
          { label: t('player.stats.whip'), field: 'stat.whip' },
          { label: t('player.stats.strikeoutsPer9Inn'), field: 'stat.strikeoutsPer9Inn' },
          { label: t('player.stats.strikeoutWalkRatio'), field: 'stat.strikeoutWalkRatio' },
          { label: t('player.stats.completeGames'), field: 'stat.completeGames' },
          { label: t('player.stats.shutouts'), field: 'stat.shutouts' },
          { label: t('player.stats.avg'), field: 'stat.avg' },
          { label: t('player.stats.obp'), field: 'stat.obp' },
          { label: t('player.stats.slg'), field: 'stat.slg' },
          { label: t('player.stats.ops'), field: 'stat.ops' },
          { label: t('player.stats.hits'), field: 'stat.hits' },
          { label: t('player.stats.runs'), field: 'stat.runs' },
          { label: t('player.stats.earnedRuns'), field: 'stat.earnedRuns' },
          { label: t('player.stats.doubles'), field: 'stat.doubles' },
          { label: t('player.stats.triples'), field: 'stat.triples' },
          { label: t('player.stats.homeRuns'), field: 'stat.homeRuns' },
          { label: t('player.stats.battersFaced'), field: 'stat.battersFaced' },
          { label: t('player.stats.airOuts'), field: 'stat.airOuts' },
          { label: t('player.stats.groundOuts'), field: 'stat.groundOuts' },
          { label: t('player.stats.groundIntoDoublePlay'), field: 'stat.groundIntoDoublePlay' },
          { label: t('player.stats.groundOutsToAirouts'), field: 'stat.groundOutsToAirouts' },
          { label: t('player.stats.balks'), field: 'stat.balks' },
          { label: t('player.stats.stolenBases'), field: 'stat.stolenBases' },
          { label: t('player.stats.caughtStealing'), field: 'stat.caughtStealing' },
          { label: t('player.stats.stolenBasePercentage'), field: 'stat.stolenBasePercentage' },
          { label: t('player.stats.strikePercentage'), field: 'stat.strikePercentage' },
          { label: t('player.stats.inheritedRunners'), field: 'stat.inheritedRunners' },
          { label: t('player.stats.inheritedRunnersScored'), field: 'stat.inheritedRunnersScored' },
          { label: t('player.stats.numberOfPitches'), field: 'stat.numberOfPitches' },
          { label: t('player.stats.pitchesPerInning'), field: 'stat.pitchesPerInning' },
          { label: t('player.stats.pickoffs'), field: 'stat.pickoffs' },
          { label: t('player.stats.sacBunts'), field: 'stat.sacBunts' },
          { label: t('player.stats.sacFlies'), field: 'stat.sacFlies' },
          { label: t('player.stats.hitsPer9Inn'), field: 'stat.hitsPer9Inn' },
          { label: t('player.stats.homeRunsPer9'), field: 'stat.homeRunsPer9' },
          { label: t('player.stats.runsScoredPer9'), field: 'stat.runsScoredPer9' },
          { label: t('player.stats.walksPer9Inn'), field: 'stat.walksPer9Inn' },
          { label: t('player.stats.strikes'), field: 'stat.strikes' },
          { label: t('player.stats.wildPitches'), field: 'stat.wildPitches' }
        ]
      } else if (selectedStatType.value === 'hitting') {
        types = [
          { label: t('player.stats.season'), field: 'season', class: 'sticky left-0 bg-gray-800' },
          { label: t('player.stats.gamesPlayed'), field: 'stat.gamesPlayed' },
          { label: t('player.stats.plateAppearances'), field: 'stat.plateAppearances' },
          { label: t('player.stats.atBats'), field: 'stat.atBats' },
          { label: t('player.stats.avg'), field: 'stat.avg' },
          { label: t('player.stats.hits'), field: 'stat.hits' },
          { label: t('player.stats.doubles'), field: 'stat.doubles' },
          { label: t('player.stats.triples'), field: 'stat.triples' },
          { label: t('player.stats.homeRuns'), field: 'stat.homeRuns' },
          { label: t('player.stats.runs'), field: 'stat.runs' },
          { label: t('player.stats.rbi'), field: 'stat.rbi' },
          { label: t('player.stats.baseOnBalls'), field: 'stat.baseOnBalls' },
          { label: t('player.stats.intentionalWalks'), field: 'stat.intentionalWalks' },
          { label: t('player.stats.hitByPitch'), field: 'stat.hitByPitch' },
          { label: t('player.stats.obp'), field: 'stat.obp' },
          { label: t('player.stats.slg'), field: 'stat.slg' },
          { label: t('player.stats.ops'), field: 'stat.ops' },
          { label: t('player.stats.groundOuts'), field: 'stat.groundOuts' },
          { label: t('player.stats.airOuts'), field: 'stat.airOuts' },
          { label: t('player.stats.strikeOuts'), field: 'stat.strikeOuts' },
          { label: t('player.stats.groundIntoDoublePlay'), field: 'stat.groundIntoDoublePlay' },
          { label: t('player.stats.totalBases'), field: 'stat.totalBases' },
          { label: t('player.stats.leftOnBase'), field: 'stat.leftOnBase' },
          { label: t('player.stats.caughtStealing'), field: 'stat.caughtStealing' },
          { label: t('player.stats.stolenBases'), field: 'stat.stolenBases' },
          { label: t('player.stats.stolenBasePercentage'), field: 'stat.stolenBasePercentage' },
          { label: t('player.stats.sacBunts'), field: 'stat.sacBunts' },
          { label: t('player.stats.sacFlies'), field: 'stat.sacFlies' },
          { label: t('player.stats.numberOfPitches'), field: 'stat.numberOfPitches' },
          { label: t('player.stats.babip'), field: 'stat.babip' },
          { label: t('player.stats.groundOutsToAirouts'), field: 'stat.groundOutsToAirouts' },
          { label: t('player.stats.atBatsPerHomeRun'), field: 'stat.atBatsPerHomeRun' }
        ]
      } else if (selectedStatType.value === 'fielding') {
        types = [
          { label: t('player.stats.seasonPOS'), field: 'season', class: 'sticky left-0 bg-gray-800' },
          { label: t('player.stats.games'), field: 'stat.games' },
          { label: t('player.stats.gamesStarted'), field: 'stat.gamesStarted' },
          { label: t('player.stats.assists'), field: 'stat.assists' },
          { label: t('player.stats.putOuts'), field: 'stat.putOuts' },
          { label: t('player.stats.chances'), field: 'stat.chances' },
          { label: t('player.stats.doublePlays'), field: 'stat.doublePlays' },
          { label: t('player.stats.errors'), field: 'stat.errors' },
          { label: t('player.stats.fielding'), field: 'stat.fielding' },
          { label: t('player.stats.rangeFactorPerGame'), field: 'stat.rangeFactorPerGame' },
        ]
      }

      return types
    })
    const nonYearTypes = computed(() => statTypes.value.filter(st => st.field !== 'season'))

    const { dateFormat } = useDateFormat()

    const { sortField, sortDirection, update } = useSortableTable(yearByYearStats, 'season', 'asc')

    return {
      t,
      player,
      seasonStats,
      careerStats,
      yearByYearStats,
      statTypes,
      selectedStatType,
      nonYearTypes,
      dateFormat,
      dateParse: parseISO,
      sortField,
      sortDirection,
      update,
      pitchingExists,
      hittingExists,
      fieldingExists
    }
  }
}
</script>

<style lang="postcss" scoped>
.season-col {
  position: sticky;
  left: 0;
  @apply bg-gray-800;
}

td {
  @apply border-t border-dashed;
}
</style>

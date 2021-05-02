<template>
  <div class="league-leaders h-home w-screen">
    <div class="w-full flex items-center justify-center p-4">
      <multiselect
        class="w-full md:w-1/2 xl:w-1/4"
        v-model="selectedType"
        placeholder="Select..."
        valueProp="key"
        :maxHeight="320"
        :options="types"
        :object="true"
      >
        <template v-slot:singlelabel="{ value }">
          {{ value.category }} - {{ value.key }}
        </template>
        <template v-slot:option="{ option }">
          {{ option.category }} - {{ option.key }}
        </template>
      </multiselect>
    </div>
    <div class="h-leaders w-full flex flex-row items-start justify-center overflow-auto p-4 mb-12">
      <table class="leaders-table table-auto bg-red-800 text-white" v-if="leagueLeaders.length">
        <thead>
          <tr>
            <th class="border-b border-white border-opacity-75" scope="col">
              {{ t('leagueLeaders.rank') }}
            </th>
            <th class="border-b border-white border-opacity-75" scope="col">
              {{ t('leagueLeaders.team') }}
            </th>
            <th class="border-b border-white border-opacity-75" scope="col">
              {{ t('leagueLeaders.name') }}
            </th>
            <th class="border-b border-white border-opacity-75" scope="col">
              {{ t('leagueLeaders.value') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in leagueLeaders" :key="player.fullName">
            <td>{{player.rank}}</td>
            <td>{{player.team.name}}</td>
            <td>{{player.person.fullName}}</td>
            <td>{{player.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import Multiselect from '@vueform/multiselect'

export default {
  name: 'LeagueLeaders',
  components: {
    Multiselect
  },
  setup() {
    const store = useStore()
    const { t } = useI18n()

    const selectedType = ref(null)

    const types = [
      { key: "assists", category: 'fielding' },
      { key: "shutouts", category: "pitching" },
      { key: "homeRuns", category: "hitting" },
      { key: "homeRuns", category: "pitching" },
      { key: "sacrificeBunts", category: "hitting" },
      { key: "sacrificeFlies", category: "hitting" },
      { key: "runs", category: "hitting" },
      { key: "groundoutToFlyoutRatio", category: "pitching" },
      { key: "groundoutToFlyoutRatio", category: "hitting" },
      { key: "stolenBases", category: "hitting" },
      { key: "groundOuts", category: "hitting" },
      { key: "numberOfPitches", category: "pitching" },
      { key: "onBasePercentage", category: "hitting" },
      { key: "caughtStealing", category: "hitting" },
      { key: "groundIntoDoublePlays", category: "hitting" },
      { key: "totalBases", category: "hitting" },
      { key: "earnedRunAverage", category: "pitching" },
      { key: "fieldingPercentage", category: "fielding" },
      { key: "walksAndHitsPerInningPitched", category: "pitching" },
      { key: "hitByPitches", category: "hitting" },
      { key: "gamesPlayed", category: "fielding" },
      { key: "gamesPlayed", category: "pitching" },
      { key: "gamesPlayed", category: "hitting" },
      { key: "walks", category: "hitting" },
      { key: "walks", category: "pitching" },
      { key: "sluggingPercentage", category: "hitting" },
      { key: "onBasePlusSlugging", category: "hitting" },
      { key: "runsBattedIn", category: "hitting" },
      { key: "triples", category: "hitting" },
      { key: "extraBaseHits", category: "hitting" },
      { key: "hits", category: "hitting" },
      { key: "atBats", category: "hitting" },
      { key: "strikeouts", category: "hitting" },
      { key: "strikeouts", category: "pitching" },
      { key: "doubles", category: "hitting" },
      { key: "totalPlateAppearances", category: "hitting" },
      { key: "intentionalWalks", category: "hitting" },
      { key: "wins", category: "pitching" },
      { key: "losses", category: "pitching" },
      { key: "saves", category: "pitching" },
      { key: "wildPitch", category: "pitching" },
      { key: "airOuts", category: "pitching" },
      { key: "balk", category: "pitching" },
      { key: "blownSaves", category: "pitching" },
      { key: "catcherEarnedRunAverage", category: "fielding" },
      { key: "catchersInterference", category: "fielding" },
      { key: "completeGames", category: "pitching" },
      { key: "doublePlays", category: "fielding" },
      { key: "earnedRun", category: "pitching" },
      { key: "errors", category: "fielding" },
      { key: "gamesStarted", category: "pitching" },
      { key: "hitBatsman", category: "pitching" },
      { key: "hitsPer9Inn", category: "pitching" },
      { key: "holds", category: "pitching" },
      { key: "innings", category: "pitching" },
      { key: "inningsPitched", category: "pitching" },
      { key: "passedBalls", category: "fielding" },
      { key: "pickoffs", category: "pitching" },
      { key: "pickoffs", category: "catching" },
      { key: "pitchesPerInning", category: "pitching" },
      { key: "putOuts", category: "fielding" },
      { key: "rangeFactorPerGame", category: "fielding" },
      { key: "rangeFactorPer9Inn", category: "fielding" },
      { key: "saveOpportunities", category: "pitching" },
      { key: "stolenBasePercentage", category: "pitching" },
      { key: "stolenBasePercentage", category: "hitting" },
      { key: "stolenBasePercentage", category: "catching" },
      { key: "strikeoutsPer9Inn", category: "pitching" },
      { key: "strikeoutWalkRatio", category: "pitching" },
      { key: "throwingErrors", category: "fielding" },
      { key: "totalBattersFaced", category: "piitching" },
      { key: "triplePlays", category: "fielding" },
      { key: "walksPer9Inn", category: "pitching" },
      { key: "winPercentage", category: "pitching" }
    ].sort((a, b) => a.category.localeCompare(b.category))

    const fetchLeaders = () => store.dispatch('updateLeagueLeaders', selectedType.value ? { statGroup: selectedType.value.category, type: selectedType.value.key } : {})

    watch(selectedType, () => fetchLeaders())

    const leagueLeaders = computed(() => store.getters.getLeagueLeaders)

    return {
      t,
      selectedType,
      types,
      leagueLeaders
    }
  }
}
</script>

<style scoped>
.leaders-table tbody tr:nth-child(odd) {
  @apply bg-red-700;
}
</style>

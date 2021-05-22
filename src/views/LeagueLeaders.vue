<template>
  <div class="league-leaders h-home w-screen">
    <div class="w-full flex items-center justify-center p-4">
      <multiselect
        class="w-full md:w-1/2 xl:w-1/4"
        id="leaderTypes"
        v-model="selectedType"
        :placeholder="t('leagueLeaders.selectPrompt')"
        valueProp="id"
        :maxHeight="320"
        :options="filteredTypes"
        :object="true"
        :searchable="true"
        @search-change="updateSearch"
        :filterResults="false"
      >
        <template v-slot:singlelabel="{ value }">
          <span class="multiselect-single-label">{{ value.label }}</span>
        </template>
        <template v-slot:option="{ option }">
          {{ option.label }}
        </template>
      </multiselect>
    </div>
    <div class="h-leaders w-full flex flex-row flex-wrap justify-center overflow-y-auto p-4 mb-12">
      <div v-if="nationalLeagueLeaders.length" class="m-4">
        <h4>American League Leaders</h4>
        <table class="leaders-table-american table-auto text-center">
          <thead>
            <tr>
              <th class="border-b border-white border-opacity-75" scope="col">
                {{ t('leagueLeaders.rank') }}
              </th>
              <th class="border-b border-white border-opacity-75" scope="col">
                {{ t('leagueLeaders.team') }}
              </th>
              <th class="border-b border-white border-opacity-75 whitespace-nowrap" scope="col">
                {{ t('leagueLeaders.name') }}
              </th>
              <th class="border-b border-white border-opacity-75" scope="col">
                {{ t('leagueLeaders.value') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in americanLeagueLeaders" :key="player.fullName">
              <td>{{player.rank}}</td>
              <td>{{teamMap.find(team => team.id === player.team.id).short}}</td>
              <td class="whitespace-nowrap">
                <router-link :to="{ name: 'Player', params: { playerId: player.person.id }}">
                  {{ player.person.fullName }}
                </router-link>
              </td>
              <td>{{player.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="nationalLeagueLeaders.length" class="m-4">
        <h4>National League Leaders</h4>
        <table class="leaders-table-national table-auto text-center">
          <thead>
            <tr>
              <th class="border-b border-white border-opacity-75" scope="col">
                {{ t('leagueLeaders.rank') }}
              </th>
              <th class="border-b border-white border-opacity-75" scope="col">
                {{ t('leagueLeaders.team') }}
              </th>
              <th class="border-b border-white border-opacity-75 whitespace-nowrap" scope="col">
                {{ t('leagueLeaders.name') }}
              </th>
              <th class="border-b border-white border-opacity-75" scope="col">
                {{ t('leagueLeaders.value') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in nationalLeagueLeaders" :key="player.fullName">
              <td>{{player.rank}}</td>
              <td>{{teamMap.find(team => team.id === player.team.id).short}}</td>
              <td class="whitespace-nowrap">
                <router-link :to="{ name: 'Player', params: { playerId: player.person.id }}">
                  {{ player.person.fullName }}
                </router-link>
              </td>
              <td>{{player.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import Fuse from 'fuse.js'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import teamMap from '@/util/teamMap';

export default {
  name: 'LeagueLeaders',
  components: {
    Multiselect
  },
  setup() {
    const store = useStore()
    const { t } = useI18n()

    const selectedType = ref(null)
    const searchText = ref('')

    const types = [
      { typeName: "assists", category: 'fielding' },
      { typeName: "shutouts", category: "pitching" },
      { typeName: "homeRuns", category: "hitting" },
      { typeName: "homeRuns", category: "pitching" },
      { typeName: "sacrificeBunts", category: "hitting" },
      { typeName: "sacrificeFlies", category: "hitting" },
      { typeName: "runs", category: "hitting" },
      { typeName: "groundoutToFlyoutRatio", category: "pitching" },
      { typeName: "groundoutToFlyoutRatio", category: "hitting" },
      { typeName: "stolenBases", category: "hitting" },
      { typeName: "groundOuts", category: "hitting" },
      { typeName: "numberOfPitches", category: "pitching" },
      { typeName: "onBasePercentage", category: "hitting" },
      { typeName: "caughtStealing", category: "hitting" },
      { typeName: "groundIntoDoublePlays", category: "hitting" },
      { typeName: "totalBases", category: "hitting" },
      { typeName: "earnedRunAverage", category: "pitching" },
      { typeName: "fieldingPercentage", category: "fielding" },
      { typeName: "walksAndHitsPerInningPitched", category: "pitching" },
      { typeName: "hitByPitches", category: "hitting" },
      { typeName: "gamesPlayed", category: "fielding" },
      { typeName: "gamesPlayed", category: "pitching" },
      { typeName: "gamesPlayed", category: "hitting" },
      { typeName: "walks", category: "hitting" },
      { typeName: "walks", category: "pitching" },
      { typeName: "sluggingPercentage", category: "hitting" },
      { typeName: "onBasePlusSlugging", category: "hitting" },
      { typeName: "runsBattedIn", category: "hitting" },
      { typeName: "triples", category: "hitting" },
      { typeName: "extraBaseHits", category: "hitting" },
      { typeName: "hits", category: "hitting" },
      { typeName: "atBats", category: "hitting" },
      { typeName: "strikeouts", category: "hitting" },
      { typeName: "strikeouts", category: "pitching" },
      { typeName: "doubles", category: "hitting" },
      { typeName: "totalPlateAppearances", category: "hitting" },
      { typeName: "intentionalWalks", category: "hitting" },
      { typeName: "wins", category: "pitching" },
      { typeName: "losses", category: "pitching" },
      { typeName: "saves", category: "pitching" },
      { typeName: "wildPitch", category: "pitching" },
      { typeName: "airOuts", category: "pitching" },
      { typeName: "balk", category: "pitching" },
      { typeName: "blownSaves", category: "pitching" },
      { typeName: "catcherEarnedRunAverage", category: "fielding", displayCategory: "catching" },
      { typeName: "catchersInterference", category: "fielding", displayCategory: "catching" },
      { typeName: "completeGames", category: "pitching" },
      { typeName: "doublePlays", category: "fielding" },
      { typeName: "earnedRun", category: "pitching" },
      { typeName: "errors", category: "fielding" },
      { typeName: "gamesStarted", category: "pitching" },
      { typeName: "hitBatsman", category: "pitching" },
      { typeName: "hitsPer9Inn", category: "pitching" },
      { typeName: "holds", category: "pitching" },
      { typeName: "innings", category: "fielding" },
      { typeName: "inningsPitched", category: "pitching" },
      { typeName: "passedBalls", category: "fielding" },
      { typeName: "pickoffs", category: "pitching" },
      { typeName: "pickoffs", category: "catching" },
      { typeName: "pitchesPerInning", category: "pitching" },
      { typeName: "putOuts", category: "fielding" },
      { typeName: "rangeFactorPerGame", category: "fielding" },
      { typeName: "rangeFactorPer9Inn", category: "fielding" },
      { typeName: "saveOpportunities", category: "pitching" },
      { typeName: "stolenBasePercentage", category: "pitching" },
      { typeName: "stolenBasePercentage", category: "hitting" },
      { typeName: "stolenBasePercentage", category: "catching" },
      { typeName: "strikeoutsPer9Inn", category: "pitching" },
      { typeName: "strikeoutWalkRatio", category: "pitching" },
      { typeName: "throwingErrors", category: "fielding" },
      { typeName: "totalBattersFaced", category: "pitching" },
      { typeName: "triplePlays", category: "fielding" },
      { typeName: "walksPer9Inn", category: "pitching" },
      { typeName: "winPercentage", category: "pitching" },
      { typeName: "battingAverage", category: "hitting" }
    ]
        .map(type => {
          type.label = `${t(`leagueLeaders.leaderTypes.${type.typeName}`)} (${t(`leagueLeaders.${type.displayCategory || type.category}`)})`;
          type.id = `${type.category}_${type.typeName}`
          return type;
        })
        .sort((a, b) => a.category.localeCompare(b.category))

    const fetchLeaders = () => store.dispatch('updateLeagueLeaders', selectedType.value ? { statGroup: selectedType.value.category, type: selectedType.value.typeName } : {})

    watch(selectedType, () => fetchLeaders())

    const americanLeagueLeaders = computed(() => store.getters.getLeagueLeaders.american)
    const nationalLeagueLeaders = computed(() => store.getters.getLeagueLeaders.national)

    const updateSearch = query => {
      searchText.value = query
    }

    const filteredTypes = computed(() => {
      if (searchText.value === '') return types
      const options = {
        keys: ['typeName', 'label', 'category'],
        findAllMatches: true
      };
      const fuse = new Fuse(types, options);
      return fuse.search(searchText.value).map(result => result.item)
    })

    return {
      teamMap,
      t,
      selectedType,
      searchText,
      updateSearch,
      filteredTypes,
      americanLeagueLeaders,
      nationalLeagueLeaders
    }
  }
}
</script>

<style scoped>
.leaders-table-american {
  @apply bg-red-800 text-white;
}

.leaders-table-american tbody tr:nth-child(odd) {
  @apply bg-red-700;
}

.leaders-table-national {
  @apply bg-blue-800 text-white;
}

.leaders-table-national tbody tr:nth-child(odd) {
  @apply bg-blue-700;
}
</style>

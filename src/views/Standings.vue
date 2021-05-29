<template>
  <div class="standings h-home w-screen overflow-y-auto">
    <div class="w-full flex flex-col items-center justify-center p-4 overflow-y-auto" v-if="standings">
      <div class="bg-gray-800 rounded-md p-4 m-2">
        <div class="text-center text-2xl font-bold">{{ t('standings.american.title') }}</div>
        <div class="flex flex-row">
          <div v-for="division in standings.american" :key="division.division.id" class="m-2">
            <div class="text-center font-bold">{{ t(`standings.american.${division.division.abbreviation}`) }}</div>
            <table class="table-auto">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">W</th>
                  <th scope="col">L</th>
                  <th scope="col">%</th>
                  <th scope="col">GB</th>
                  <th scope="col">WC</th>
                  <th scope="col">RS</th>
                  <th scope="col">RA</th>
                  <th scope="col">Δ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in division.teamRecords" :key="record.team.id">
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="bg-gray-800 rounded-md p-4 m-2">
        <div class="text-center text-2xl font-bold">{{ t('standings.national.title') }}</div>
        <div class="flex flex-row">
          <div v-for="division in standings.national" :key="division.division.id" class="m-2">
            <div class="text-center font-bold">{{ t(`standings.national.${division.division.abbreviation}`) }}</div>
            <table class="table-auto">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">W</th>
                  <th scope="col">L</th>
                  <th scope="col">%</th>
                  <th scope="col">GB</th>
                  <th scope="col">WC</th>
                  <th scope="col">RS</th>
                  <th scope="col">RA</th>
                  <th scope="col">Δ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in division.teamRecords" :key="record.team.id">
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
              </tbody>
            </table>
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

export default {
  name: 'Standings',
  setup() {
    const store = useStore()
    const { t } = useI18n()

    store.dispatch('fetchStandings')

    const standings = computed(() => store.getters.getStandings)

    return {
      t,
      standings
    }
  }
}
</script>

<style scoped>
table tbody tr:nth-child(odd) {
  @apply bg-gray-700;
}
</style>

<template>
  <div class="player h-home w-screen overflow-y-auto">
    <div class="w-full flex items-center justify-center p-4 overflow-y-auto">
      <div v-if="player && player.id" class="bg-gray-800 rounded-md m-4 w-full xl:w-3/4">
        <div class="w-full pt-6 pl-6 font-bold text-2xl">{{ player.fullName }} - #{{ player.primaryNumber }}</div>
        <div class="w-full pl-6 italic text-md" v-if="player.nickName">{{ t('player.playerInfo.nickname', { nickname: player.nickName }) }}</div>
        <div class="flex flex-row">
          <div class="flex flex-col p-6">
            <span>{{ t('player.playerInfo.bats', { bats: player.batSide.code }) }}</span>
            <span>{{ t('player.playerInfo.throws', { throws: player.pitchHand.code }) }}</span>
            <span>{{ t('player.playerInfo.height', { height: player.height }) }}</span>
            <span>{{ t('player.playerInfo.weight', { weight: player.weight }) }}</span>
          </div>
          <div class="flex flex-col p-6">
            <span>{{ t('player.playerInfo.age', { age: player.currentAge }) }}</span>
            <span>{{ t('player.playerInfo.birthday', { birthday: dateFormat(dateParse(player.birthDate)) }) }}</span>
            <span>{{ t('player.playerInfo.birthplace', { birthplace: [player.birthCity, player.birthStateProvince, player.birthCountry].filter(v => v).join(', ') }) }}</span>
            <span>{{ t('player.playerInfo.drafted', { drafted: player.draftYear }) }}</span>
            <span>{{ t('player.playerInfo.debut', { debut: dateFormat(dateParse(player.mlbDebutDate)) }) }}</span>
          </div>
        </div>
        <div class="w-full pl-6 pt-6 font-bold text-3xl text-center">{{ currentSeason }}</div>
        <div class="w-full pt-6 pb-6 flex flex-row flex-wrap justify-center">
          <div v-for="stat in statTypes" :key="stat.field" class="flex flex-col items-center m-3">
            <span class="font-bold">{{stat.label}}</span>
            <span class="text-4xl font-bold">{{seasonStats[stat.field]}}</span>
          </div>
        </div>
        <div class="w-full pl-6 pt-6 font-bold text-3xl text-center">Career</div>
        <div class="w-full pt-6 pb-6 flex flex-row flex-wrap justify-center">
          <div v-for="stat in statTypes" :key="stat.field" class="flex flex-col items-center m-3">
            <span class="font-bold">{{stat.label}}</span>
            <span class="text-4xl font-bold">{{careerStats[stat.field]}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseISO } from 'date-fns'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import useDateFormat from '@/composables/useDateFormat'

export default {
  name: 'Player',
  components: {},
  setup() {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()
    const getPlayer = () => store.dispatch('fetchPlayer', route.params.playerId)
    getPlayer()

    const player = computed(() => store.getters.getPlayer(route.params.playerId))
    const statType = computed(() => (player.value.primaryPosition || {}).code === '1' ? 'pitching' : 'hitting')
    const seasonStats = computed(() => player.value.stats.find(s => s.type.displayName === 'season' && s.group.displayName === statType.value).splits[0].stat)
    const careerStats = computed(() => player.value.stats.find(s => s.type.displayName === 'career' && s.group.displayName === statType.value).splits[0].stat)
    const currentSeason = computed(() => player.value.stats.find(s => s.type.displayName === 'season' && s.group.displayName === statType.value).splits[0].season)

    const statTypes = computed(() => {
      let types
      if (statType.value === 'pitching') {
        types = [
          { label: t('player.stats.wins'), field: 'wins' },
          { label: t('player.stats.loses'), field: 'loses' },
          { label: t('player.stats.winPercentage'), field: 'winPercentage' },
          { label: t('player.stats.holds'), field: 'holds' },
          { label: t('player.stats.saves'), field: 'saves' },
          { label: t('player.stats.saveOpportunities'), field: 'saveOpportunities' },
          { label: t('player.stats.gamesStarted'), field: 'gamesStarted' },
          { label: t('player.stats.gamesPitched'), field: 'gamesPitched' },
          { label: t('player.stats.gamesPlayed'), field: 'gamesPlayed' },
          { label: t('player.stats.inningsPitched'), field: 'inningsPitched' },
          { label: t('player.stats.strikeOuts'), field: 'strikeOuts' },
          { label: t('player.stats.baseOnBalls'), field: 'baseOnBalls' },
          { label: t('player.stats.intentionalWalks'), field: 'intentionalWalks' },
          { label: t('player.stats.hitByPitch'), field: 'hitByPitch' },
          { label: t('player.stats.era'), field: 'era' },
          { label: t('player.stats.whip'), field: 'whip' },
          { label: t('player.stats.strikeoutsPer9Inn'), field: 'strikeoutsPer9Inn' },
          { label: t('player.stats.strikeoutWalkRatio'), field: 'strikeoutWalkRatio' },
          { label: t('player.stats.completeGames'), field: 'completeGames' },
          { label: t('player.stats.shutouts'), field: 'shutouts' },
          { label: t('player.stats.avg'), field: 'avg' },
          { label: t('player.stats.obp'), field: 'obp' },
          { label: t('player.stats.slg'), field: 'slg' },
          { label: t('player.stats.ops'), field: 'ops' },
          { label: t('player.stats.hits'), field: 'hits' },
          { label: t('player.stats.runs'), field: 'runs' },
          { label: t('player.stats.earnedRuns'), field: 'earnedRuns' },
          { label: t('player.stats.doubles'), field: 'doubles' },
          { label: t('player.stats.triples'), field: 'triples' },
          { label: t('player.stats.homeRuns'), field: 'homeRuns' },
          { label: t('player.stats.battersFaced'), field: 'battersFaced' },
          { label: t('player.stats.airOuts'), field: 'airOuts' },
          { label: t('player.stats.groundOuts'), field: 'groundOuts' },
          { label: t('player.stats.groundIntoDoublePlay'), field: 'groundIntoDoublePlay' },
          { label: t('player.stats.groundOutsToAirouts'), field: 'groundOutsToAirouts' },
          { label: t('player.stats.balks'), field: 'balks' },
          { label: t('player.stats.stolenBases'), field: 'stolenBases' },
          { label: t('player.stats.caughtStealing'), field: 'caughtStealing' },
          { label: t('player.stats.stolenBasePercentage'), field: 'stolenBasePercentage' },
          { label: t('player.stats.strikePercentage'), field: 'strikePercentage' },
          { label: t('player.stats.inheritedRunners'), field: 'inheritedRunners' },
          { label: t('player.stats.inheritedRunnersScored'), field: 'inheritedRunnersScored' },
          { label: t('player.stats.numberOfPitches'), field: 'numberOfPitches' },
          { label: t('player.stats.pitchesPerInning'), field: 'pitchesPerInning' },
          { label: t('player.stats.pickoffs'), field: 'pickoffs' },
          { label: t('player.stats.sacBunts'), field: 'sacBunts' },
          { label: t('player.stats.sacFlies'), field: 'sacFlies' },
          { label: t('player.stats.hitsPer9Inn'), field: 'hitsPer9Inn' },
          { label: t('player.stats.homeRunsPer9'), field: 'homeRunsPer9' },
          { label: t('player.stats.runsScoredPer9'), field: 'runsScoredPer9' },
          { label: t('player.stats.walksPer9Inn'), field: 'walksPer9Inn' },
          { label: t('player.stats.strikes'), field: 'strikes' },
          { label: t('player.stats.wildPitches'), field: 'wildPitches' }
        ]
      } else {
        types = [
          { label: t('player.stats.gamesPlayed'), field: 'gamesPlayed' },
          { label: t('player.stats.plateAppearances'), field: 'plateAppearances' },
          { label: t('player.stats.atBats'), field: 'atBats' },
          { label: t('player.stats.avg'), field: 'avg' },
          { label: t('player.stats.hits'), field: 'hits' },
          { label: t('player.stats.doubles'), field: 'doubles' },
          { label: t('player.stats.triples'), field: 'triples' },
          { label: t('player.stats.homeRuns'), field: 'homeRuns' },
          { label: t('player.stats.runs'), field: 'runs' },
          { label: t('player.stats.rbi'), field: 'rbi' },
          { label: t('player.stats.baseOnBalls'), field: 'baseOnBalls' },
          { label: t('player.stats.intentionalWalks'), field: 'intentionalWalks' },
          { label: t('player.stats.hitByPitch'), field: 'hitByPitch' },
          { label: t('player.stats.obp'), field: 'obp' },
          { label: t('player.stats.slg'), field: 'slg' },
          { label: t('player.stats.ops'), field: 'ops' },
          { label: t('player.stats.groundOuts'), field: 'groundOuts' },
          { label: t('player.stats.airOuts'), field: 'airOuts' },
          { label: t('player.stats.strikeOuts'), field: 'strikeOuts' },
          { label: t('player.stats.groundIntoDoublePlay'), field: 'groundIntoDoublePlay' },
          { label: t('player.stats.totalBases'), field: 'totalBases' },
          { label: t('player.stats.leftOnBase'), field: 'leftOnBase' },
          { label: t('player.stats.caughtStealing'), field: 'caughtStealing' },
          { label: t('player.stats.stolenBases'), field: 'stolenBases' },
          { label: t('player.stats.stolenBasePercentage'), field: 'stolenBasePercentage' },
          { label: t('player.stats.sacBunts'), field: 'sacBunts' },
          { label: t('player.stats.sacFlies'), field: 'sacFlies' },
          { label: t('player.stats.numberOfPitches'), field: 'numberOfPitches' },
          { label: t('player.stats.babip'), field: 'babip' },
          { label: t('player.stats.groundOutsToAirouts'), field: 'groundOutsToAirouts' },
          { label: t('player.stats.atBatsPerHomeRun'), field: 'atBatsPerHomeRun' }
        ]
      }

      return types
    })

    const { dateFormat } = useDateFormat()

    return {
      t,
      player,
      seasonStats,
      careerStats,
      currentSeason,
      statTypes,
      dateFormat,
      dateParse: parseISO
    }
  }
}
</script>

<style scoped>

</style>

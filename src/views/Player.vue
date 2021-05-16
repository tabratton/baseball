<template>
  <div class="player h-home w-screen">
    <div class="w-full flex items-center justify-center p-4">
      <div v-if="player.id" class="bg-gray-800 rounded-md w-1/2">
        <div class="w-full pt-6 pl-6 font-bold text-2xl">{{player.fullName}} (#{{player.primaryNumber}})</div>
        <div class="w-full pl-6 italic text-sm">Nickname - {{player.nickName}}</div>
        <div class="flex flex-row">
          <div class="flex flex-col p-6">
            <span>Bats: {{player.batSide.code}}</span>
            <span>Throws: {{player.pitchHand.code}}</span>
            <span>Height: {{player.height}}</span>
            <span>Weight: {{player.weight}}lbs.</span>
          </div>
          <div class="flex flex-col p-6">
            <span>Age: {{player.currentAge}}</span>
            <span>Birthday: {{player.birthDate}}</span>
            <span>Birthplace: {{[player.birthCity, player.birthStateProvince, player.birthCountry].filter(v => v).join(', ')}}</span>
            <span>Drafted: {{player.draftYear}}</span>
            <span>MLB Debut: {{player.mlbDebutDate}}</span>
          </div>
        </div>
        <div class="w-full pl-6 pt-6 font-bold text-3xl text-center">{{seasonHitting.splits[0].season}}</div>
        <div class="w-full pt-6 pb-6 flex flex-row flex-wrap justify-center">
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Games Played</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.gamesPlayed}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">PA</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.plateAppearances}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">AB</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.atBats}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">AVG</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.avg}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Hits</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.hits}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Doubles</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.doubles}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Triples</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.triples}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">HR</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.homeRuns}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Runs</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.runs}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">RBI</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.rbi}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">BB</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.baseOnBalls}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">IBB</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.intentionalWalks}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">HBP</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.hitByPitch}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">OBP</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.obp}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SLG</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.slg}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">OPS</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.ops}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Ground Outs</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.groundOuts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Air Outs</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.airOuts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SO</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.strikeOuts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">GIDP</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.groundIntoDoublePlay}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Total Bases</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.totalBases}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">LOB</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.leftOnBase}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">CS</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.caughtStealing}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SB</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.stolenBases}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SB %</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.stolenBasePercentage}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Sac Bunts</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.sacBunts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Sac Flies</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.sacFlies}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">No. Pitches</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.numberOfPitches}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">BABIP</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.babip}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Ground Outs/Air Outs</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.groundOutsToAirouts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">AB/HR</span>
            <span class="text-4xl font-bold">{{seasonHitting.splits[0].stat.atBatsPerHomeRun}}</span>
          </div>
        </div>
        <div class="w-full pl-6 pt-6 font-bold text-3xl text-center">Career</div>
        <div class="w-full pt-6 pb-6 flex flex-row flex-wrap justify-center">
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Games Played</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.gamesPlayed}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">PA</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.plateAppearances}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">AB</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.atBats}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">AVG</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.avg}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Hits</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.hits}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Doubles</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.doubles}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Triples</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.triples}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">HR</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.homeRuns}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Runs</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.runs}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">RBI</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.rbi}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">BB</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.baseOnBalls}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">IBB</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.intentionalWalks}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">HBP</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.hitByPitch}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">OBP</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.obp}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SLG</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.slg}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">OPS</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.ops}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Ground Outs</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.groundOuts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Air Outs</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.airOuts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SO</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.strikeOuts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">GIDP</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.groundIntoDoublePlay}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Total Bases</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.totalBases}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">LOB</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.leftOnBase}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">CS</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.caughtStealing}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SB</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.stolenBases}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">SB %</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.stolenBasePercentage}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Sac Bunts</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.sacBunts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Sac Flies</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.sacFlies}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">No. Pitches</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.numberOfPitches}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">BABIP</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.babip}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">Ground Outs/Air Outs</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.groundOutsToAirouts}}</span>
          </div>
          <div class="flex flex-col items-center mr-6 ml-6 mt-4">
            <span class="font-bold">AB/HR</span>
            <span class="text-4xl font-bold">{{careerHitting.splits[0].stat.atBatsPerHomeRun}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'Player',
  components: {

  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const getPlayer = () => store.dispatch('getPlayer', route.params.playerId)
    getPlayer()

    const player = computed(() => store.getters.getPlayer(route.params.playerId))

    const seasonHitting = computed(() => player.value.stats.find(s => s.type.displayName === 'season' && s.group.displayName === 'hitting'))
    const careerHitting = computed(() => player.value.stats.find(s => s.type.displayName === 'career' && s.group.displayName === 'hitting'))

    return {
      player,
      seasonHitting,
      careerHitting
    }
  }
}
</script>

<style scoped>

</style>

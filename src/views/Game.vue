<template>
  <div class="game w-screen">
    <ScorebugList class="shadow-md flex flex-row overflow-y-hidden overflow-x-auto"/>
    <div class="overflow-auto p-4 h-content">
      <div class="flex flex-row items-start justify-center">
        <Scorebug v-if="scorebug && scorebug.inProgress" :game="scorebug" :disableClick="true"/>
        <Boxscore v-if="boxscore" :game="boxscore"/>
      </div>
      <Players v-if="batters" :game="batters"/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Players from '@/components/Players'
import Boxscore from '@/components/Boxscore'
import Scorebug from '@/components/Scorebug'
import ScorebugList from '@/components/ScorebugList'

import createPlayersObj from '@/util/createPlayersObj'
import createBoxscoreObj from '@/util/createBoxscoreObj'
import createScorebugObj from '@/util/createScorebugObj'

export default {
  name: 'Game',
  components: {
    Boxscore,
    Players,
    Scorebug,
    ScorebugList
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    const gamePk = computed(() => route.params.gamepk)
    const gameData = computed(() => store.state.games.find(g => g.gamePk === gamePk.value))

    return {
      model: store,
      boxscore: computed(() => createBoxscoreObj(gameData.value)),
      scorebug: computed(() => createScorebugObj(gameData.value)),
      batters: computed(() => createPlayersObj(gameData.value))
    }
  }
}
</script>

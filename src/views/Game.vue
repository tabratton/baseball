<template>
  <div class="game w-screen">
    <ScorebugList class="shadow-md flex flex-row overflow-y-hidden overflow-x-auto p-2"/>
    <div class="overflow-auto p-4 h-content">
      <div class="flex flex-col md:flex-row items-center justify-center">
        <Scorebug v-if="scorebug && scorebug.inProgress" :game="scorebug" :disableClick="true"/>
        <Boxscore :gamePk="gamePk"/>
      </div>
      <Players :gamePk="gamePk"/>
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
import useScorebugData from '@/composables/useScorebugData'

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
    const scorebug = computed(() => store.getters.getScorebug(gamePk.value))

    useScorebugData()

    return {
      gamePk,
      scorebug
    }
  }
}
</script>

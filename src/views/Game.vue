<template>
  <div class="game w-screen">
    <ScorebugList v-if="date" class="shadow-md flex flex-row overflow-y-hidden overflow-x-auto p-2" :date="date"/>
    <div class="overflow-y-auto p-4 w-full h-content">
      <div class="flex flex-row flex-wrap items-center justify-center">
        <Scorebug v-if="scorebug && scorebug.inProgress" :game="scorebug" :disableClick="true"/>
        <Boxscore :gamePk="gamePk"/>
      </div>
      <Players class="w-full" :gamePk="gamePk"/>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Players from '@/components/Players'
import Boxscore from '@/components/Boxscore'
import Scorebug from '@/components/Scorebug'
import ScorebugList from '@/components/ScorebugList'
import { parseISO } from 'date-fns'

export default {
  name: 'GameView',
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

    const fetchData = () => store.dispatch('fetchGame', gamePk.value)
    fetchData()

    watch(gamePk, () => fetchData())

    const scorebug = computed(() => store.getters.getScorebug(gamePk.value))
    const date = computed(() => scorebug.value ? parseISO(scorebug.value.gameDate) : null)

    watch(date, () => {
      if (date.value) {
        store.commit('updateDate', date.value)
      }
    })

    return {
      gamePk,
      scorebug,
      date
    }
  }
}
</script>

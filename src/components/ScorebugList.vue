<template>
  <div class="">
    <Scorebug v-for="g in games" :key="g.gamePk" :game="g"/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import createScorebugObj from '@/util/createScorebugObj'
import Scorebug from '@/components/Scorebug.vue'

export default {
  name: 'ScorebugList',
  components: {
    Scorebug
  },
  setup() {
    const store = useStore()

    return {
      games: computed(() => store.state.games.map(game => createScorebugObj(game)))
    }
  }
}
</script>

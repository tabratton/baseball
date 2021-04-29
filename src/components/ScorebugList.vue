<template>
  <div class="bg-gray-200 dark:bg-black dark:bg-opacity-80 rounded">
    <Scorebug
      v-for="g in games.filter(game => game.inProgress).sort((a, b) => a.inning > b.inning ? 1 : (a.inning === b.inning ? 0 : -1))"
      :key="g.gamePk"
      :game="g"
    />
    <Scorebug
      v-for="g in games.filter(game => !game.inProgress)"
      :key="g.gamePk"
      :game="g"
    />
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

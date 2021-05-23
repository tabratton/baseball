<template>
  <div class="bg-gray-200 dark:bg-black dark:bg-opacity-80 rounded">
    <Scorebug
      v-for="g in inProgress"
      :key="g.gamePk"
      :game="g"
    />
    <Scorebug
      v-for="g in notInProgress"
      :key="g.gamePk"
      :game="g"
    />
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'

import Scorebug from '@/components/Scorebug.vue'
import useScorebugListData from '@/composables/useScorebugListData'
import { format } from 'date-fns'

export default {
  name: 'ScorebugList',
  components: {
    Scorebug
  },
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const { date } = toRefs(props)

    useScorebugListData(date)

    const games = computed(() => store.getters.scorebugGames(format(date.value, 'yyyy-MM-dd')))
    const inProgress = computed(() => games.value.filter(game => game.inProgress).sort((a, b) => a.inning > b.inning ? 1 : (a.inning === b.inning ? 0 : -1)))
    const notInProgress = computed(() => games.value.filter(game => !game.inProgress))

    return {
      games,
      inProgress,
      notInProgress
    }
  }
}
</script>

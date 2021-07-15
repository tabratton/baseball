<template>
  <div class="bg-transparent rounded">
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
    <div
      v-if="inProgress.length === 0 && notInProgress.length === 0"
      class="flex items-center justify-items-center h-full"
    >
      {{ t('scorebugList.noGames')}}
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import Scorebug from '@/components/Scorebug.vue'
import useScorebugListData from '@/composables/useScorebugListData'

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
    const { t } = useI18n()

    useScorebugListData(date)

    const games = computed(() => store.getters.scorebugGames(format(date.value, 'yyyy-MM-dd')))
    const inProgress = computed(() => games.value.filter(game => game.inProgress).sort((a, b) => a.inning > b.inning ? 1 : (a.inning === b.inning ? 0 : -1)))
    const notInProgress = computed(() => games.value.filter(game => !game.inProgress))

    return {
      t,
      games,
      inProgress,
      notInProgress
    }
  }
}
</script>

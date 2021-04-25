<template>
  <div class="about w-full flex justify-center">
    <div class="flex flex-row flex-wrap w-2/3 mt-12">

    </div>
  </div>
</template>

<script>
import MLBStatsAPI from 'mlb-stats-api'
// import { all, hash } from 'rsvp'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// import Scorebug from '@/components/Scorebug.vue'

// import teamMap from '@/util/teamMap'

export default {
  name: 'Home',
  // components: {
  //   Scorebug
  // },
  setup(props, { emit }) {
    const route = useRoute()
    const model = ref([])
    const timer = ref(null)

    const mlbStats = new MLBStatsAPI()
    const gamePk = route.params.gamepk

    const fetchData = async () => {
      const gameData = await mlbStats.getGameLinescore({ pathParams: { gamePk: gamePk } }).then(({ data }) => data)
      console.log(gameData)
      model.value = []
    }

    onMounted(() => {
      fetchData()
      // timer.value = setInterval(fetchData, 60000)
    })

    onBeforeUnmount(() => clearInterval(timer))

    return {
      model,
      emit
    }
  }
}
</script>

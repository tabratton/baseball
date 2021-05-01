<template>
  <div class="boxscore m-2" v-if="boxscore">
    <table class="table-auto w-full text-white text-center">
      <slot name="caption"></slot>
      <thead>
        <tr class="bg-black">
          <th scope="col">{{ boxscore.status }}</th>
          <th scope="col" v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr :class="`${boxscore.away.bgClass} ${boxscore.away.textClass}`">
          <td>{{ boxscore.away.name }}</td>
          <td v-for="score in boxscore.away.innings" :key="score">{{ score.runs }}</td>
          <td>{{ boxscore.away.runs }}</td>
          <td>{{ boxscore.away.hits }}</td>
          <td>{{ boxscore.away.errors }}</td>
        </tr>

        <tr :class="`${boxscore.home.bgClass} ${boxscore.home.textClass}`">
          <td>{{ boxscore.home.name }}</td>
          <td v-for="score in boxscore.home.innings" :key="score">{{ score.runs }}</td>
          <td>{{ boxscore.home.runs }}</td>
          <td>{{ boxscore.home.hits }}</td>
          <td>{{ boxscore.home.errors }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex w-full justify-between mt-2 text-sm font-bold">
      <span v-if="boxscore.isPregame">Starts at {{ boxscore.gameTime }}</span>
      <span class="mr-2">{{ boxscore.winningPitcher }}</span>
      <span class="mr-2">{{ boxscore.losingPitcher }}</span>
      <span>{{ boxscore.save }}</span>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Boxscore',
  props: {
    gamePk: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { gamePk } = toRefs(props)
    const store = useStore()

    const boxscore = computed(() => store.getters.getBoxScore(gamePk.value))

    const headers = computed(() => {
      const hs = boxscore.value ? boxscore.value.away.innings.map((inning, index) => `${index + 1}`) : []
      hs.push('R', 'H', 'E')
      return hs
    })

    return {
      format,
      boxscore,
      headers
    }
  }
}
</script>

<style scoped>
.boxscore table th:first-of-type,
.boxscore table td:first-of-type {
  @apply text-left;
}
</style>

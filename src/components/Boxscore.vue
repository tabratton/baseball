<template>
  <div class="boxscore m-2">
    <table class="table-auto w-full text-white text-center">
      <caption class="sr-only">Boxscore</caption>
      <thead>
        <tr class="bg-black">
          <th scope="col">{{ game.status }}</th>
          <th scope="col" v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr :class="game.away.bgClass">
          <td>{{ game.away.name }}</td>
          <td v-for="score in game.away.innings" :key="score">{{ score.runs }}</td>
          <td>{{ game.away.runs }}</td>
          <td>{{ game.away.hits }}</td>
          <td>{{ game.away.errors }}</td>
        </tr>

        <tr :class="game.home.bgClass">
          <td>{{ game.home.name }}</td>
          <td v-for="score in game.home.innings" :key="score">{{ score.runs }}</td>
          <td>{{ game.home.runs }}</td>
          <td>{{ game.home.hits }}</td>
          <td>{{ game.home.errors }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex w-full justify-between mt-2 text-sm font-bold">
      <span v-if="game.isPregame">Starts at {{ game.gameTime }}</span>
      <span class="mr-2">{{ game.winningPitcher }}</span>
      <span class="mr-2">{{ game.losingPitcher }}</span>
      <span>{{ game.save }}</span>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { computed, toRefs } from 'vue'

export default {
  name: 'Boxscore',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { game } = toRefs(props)

    const headers = computed(() => {
      const hs = game.value.away.innings.map((inning, index) => `${index + 1}`)
      hs.push('R', 'H', 'E')
      return hs
    })

    return {
      format,
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

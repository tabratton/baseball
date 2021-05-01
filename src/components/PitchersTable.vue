<template>
  <h4 class="font-bold text-lg text-center">{{ team.teamName }} - Pitchers</h4>
  <table :class="{ [team.bgClass]: true, [team.textClass]: true }" class="players-table table-auto text-center text-white">
    <caption class="sr-only">{{ side === 'home' ? 'Home' : 'Away' }} Pitchers</caption>
    <thead>
      <tr>
        <th v-for="header in pitcherHeaders" :key="header" scope="col">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in team.pitchers" :key="player.jerseyNumber">
        <td>{{ player.person.fullName }}</td>
        <td>{{ player.jerseyNumber }}</td>
        <td>{{ player.stats.pitching.inningsPitched }}</td>
        <td>{{ player.stats.pitching.hits }}</td>
        <td>{{ player.stats.pitching.earnedRuns }}</td>
        <td>{{ player.stats.pitching.strikeOuts }}</td>
        <td>{{ player.stats.pitching.baseOnBalls }}</td>
        <td>{{ player.stats.pitching.balls }}/{{ player.stats.pitching.strikes }}</td>
        <td>{{ numbro(player.stats.pitching.earnedRuns * 9 / Number(player.stats.pitching.inningsPitched)).format({ mantissa: 2 }) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import numbro from 'numbro'
import { computed, toRefs } from 'vue'

export default {
  name: 'PitchersTable',
  props: {
    game: {
      type: Object,
      required: true
    },
    side: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { game, side } = toRefs(props)

    const team = computed(() => game.value[side.value])

    return {
      numbro,
      team,
      pitcherHeaders: ['Name', '#', 'IP', 'H', 'ER', 'K', 'BB', 'B/S', 'ERA']
    }
  }
}
</script>

<style scoped>
.players-table {
  @apply border-collapse border border-white border-opacity-50;
}

.players-table th,
.players-table td {
  @apply pr-3 pl-3;
}

.players-table td {
  @apply border-l border-r border-white border-opacity-60;
}

.players-table th {
  @apply border-b border-white border-opacity-60;
}
</style>

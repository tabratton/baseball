<template>
  <h4 class="font-bold text-lg text-center">{{team.teamName}} - Batters</h4>
  <table :class="{ [team.bgClass]: true, [team.textClass]: true }" class="players-table table-auto text-center mb-4 text-white">
    <caption class="sr-only">{{ side === 'home' ? 'Home' : 'Away' }} Batters</caption>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col" v-for="header in batterHeaders" :key="header">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in team.batters" :key="player.jerseyNumber">
        <td>{{ Number.isInteger(Number(player.battingOrder) / 100) ? `${Number(player.battingOrder) / 100}.` : '' }}</td>
        <td>{{ player.position.abbreviation }}</td>
        <td>{{ player.person.fullName }}</td>
        <td>{{ player.jerseyNumber }}</td>
        <td>{{ player.stats.batting.atBats }}</td>
        <td>{{ player.stats.batting.runs }}</td>
        <td>{{ player.stats.batting.hits }}</td>
        <td>{{ player.stats.batting.hits - player.stats.batting.doubles - player.stats.batting.triples - player.stats.batting.homeRuns }}</td>
        <td>{{ player.stats.batting.doubles }}</td>
        <td>{{ player.stats.batting.triples }}</td>
        <td>{{ player.stats.batting.homeRuns }}</td>
        <td>{{ player.stats.batting.baseOnBalls }}</td>
        <td>{{ player.stats.batting.hitByPitch }}</td>
        <td>{{ player.stats.batting.rbi }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
  name: 'PlayerTable',
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
      team,
      batterHeaders: ['POS', 'Name', '#', 'AB', 'R', 'H', '1B', '2B', '3B', 'HR', 'BB', 'HBP', 'RBI']
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

<template>
  <div class="flex flex-row items-start justify-center">
    <div class="flex flex-col items-center justify-start m-2">
      <table :class="{ [game.away.bgClass]: true }" class="players-table table-auto text-center text-white">
        <caption class="sr-only">Away Batters</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" v-for="header in batterHeaders" :key="header">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.away.batters" :key="player.jerseyNumber">
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
      <table :class="{ [game.away.bgClass]: true }" class="players-table table-auto text-center mt-4 text-white">
        <caption class="sr-only">Away Pitchers</caption>
        <thead>
          <tr>
            <th v-for="header in pitcherHeaders" :key="header" scope="col">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.away.pitchers" :key="player.jerseyNumber">
            <td>{{ player.person.fullName }}</td>
            <td>{{ player.jerseyNumber }}</td>
            <td>{{ player.stats.pitching.inningsPitched }}</td>
            <td>{{ player.stats.pitching.strikeOuts }}</td>
            <td>{{ player.stats.pitching.hits }}</td>
            <td>{{ player.stats.pitching.baseOnBalls }}</td>
            <td>{{ player.stats.pitching.runs }}</td>
            <td>{{ player.stats.pitching.balls }}/{{ player.stats.pitching.strikes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col justify-start items-center m-2">
      <table :class="{ [game.home.bgClass]: true }" class="players-table table-auto text-center text-white">
        <caption class="sr-only">Home Batters</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" v-for="header in batterHeaders" :key="header">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.home.batters" :key="player.jerseyNumber">
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
      <table :class="{ [game.home.bgClass]: true }" class="players-table table-auto text-center mt-4 text-white">
        <caption class="sr-only">Home Pitchers</caption>
        <thead>
          <tr>
            <th v-for="header in pitcherHeaders" :key="header" scope="col">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.home.pitchers" :key="player.jerseyNumber">
            <td>{{ player.person.fullName }}</td>
            <td>{{ player.jerseyNumber }}</td>
            <td>{{ player.stats.pitching.inningsPitched }}</td>
            <td>{{ player.stats.pitching.strikeOuts }}</td>
            <td>{{ player.stats.pitching.hits }}</td>
            <td>{{ player.stats.pitching.baseOnBalls }}</td>
            <td>{{ player.stats.pitching.runs }}</td>
            <td>{{ player.stats.pitching.balls }}/{{ player.stats.pitching.strikes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Players',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      batterHeaders: ['POS', 'Name', '#', 'AB', 'R', 'H', '1B', '2B', '3B', 'HR', 'BB', 'HBP', 'RBI'],
      pitcherHeaders: ['Name', '#', 'IP', 'K', 'H', 'BB', 'R', 'B/S']
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

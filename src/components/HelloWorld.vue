<template>
  <div class="hello bg-gray-100 py-6 px-6">
    <div class="flex flex-row justify-between items-start">
      <div class="mt-4">
        <table class="table-auto w-full text-white text-center">
          <caption class="sr-only">Boxscore</caption>
          <thead>
            <tr class="bg-black">
              <th scope="col">Final</th>
              <th scope="col" v-for="header in boxscoreHeaders" :key="header">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-lad-main">
              <td>{{ teams.away.team.toUpperCase() }}</td>
              <td v-for="score in teams.away.innings" :key="score">{{ score }}</td>
              <td>{{ teams.away.runs }}</td>
              <td>{{ teams.away.hits }}</td>
              <td>{{ teams.away.errors }}</td>
            </tr>

            <tr class="bg-sdp-main">
              <td>{{ teams.home.team.toUpperCase() }}</td>
              <td v-for="score in teams.home.innings" :key="score">{{ score }}</td>
              <td>{{ teams.home.runs }}</td>
              <td>{{ teams.home.hits }}</td>
              <td>{{ teams.home.errors }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex w-full justify-between mt-2 text-sm font-bold">
          <span class="mr-2">{{ game.winningPitcher }}</span>
          <span class="mr-2">{{ game.losingPitcher }}</span>
          <span>{{ game.save }}</span>
        </div>
      </div>

      <div class="flex mt-4">
        <div class="mr-4">
          <table class="table-auto text-center text-white bg-lad-main roster-table">
            <caption class="sr-only">Away Roster</caption>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col" v-for="header in rosterHeaders" :key="header">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in teams.away.roster" :key="player.name">
                <td>{{ player.order }}</td>
                <td>{{ player.pos }}</td>
                <td>{{ player.name }}</td>
                <td>{{ player.number }}</td>
                <td>{{ player.atBats }}</td>
                <td>{{ player.runs }}</td>
                <td>{{ player.hits }}</td>
                <td>{{ player.singles }}</td>
                <td>{{ player.doubles }}</td>
                <td>{{ player.triples }}</td>
                <td>{{ player.homeRuns }}</td>
                <td>{{ player.walks }}</td>
                <td>{{ player.hbp }}</td>
                <td>{{ player.rbi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table class="table-auto text-center text-white bg-sdp-main roster-table">
            <caption class="sr-only">Home Roster</caption>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col" v-for="header in rosterHeaders" :key="header">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in teams.home.roster" :key="player.name">
                <td>{{ player.order }}</td>
                <td>{{ player.pos }}</td>
                <td>{{ player.name }}</td>
                <td>{{ player.number }}</td>
                <td>{{ player.atBats }}</td>
                <td>{{ player.runs }}</td>
                <td>{{ player.hits }}</td>
                <td>{{ player.singles }}</td>
                <td>{{ player.doubles }}</td>
                <td>{{ player.triples }}</td>
                <td>{{ player.homeRuns }}</td>
                <td>{{ player.walks }}</td>
                <td>{{ player.hbp }}</td>
                <td>{{ player.rbi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  setup(props, { emit }) {
    return {
      teams: {
        home: {
          team: 'sdp',
          innings: [0, 0, 0, 1, 0, 0, 1, 3, 'x'],
          hits: 7,
          runs: 5,
          errors: 0,
          current: {
            player: {
              name: 'Snell',
              count: 69
            },
            score: 5
          },
          roster: [
            {
              order: '1.',
              pos: 'RF',
              name: 'Jurickson Profar',
              number: 10,
              atBats: 4,
              hits: 0,
              runs: 1,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '2.',
              pos: '2B',
              name: 'Jake Cronenworth',
              number: 9,
              atBats: 4,
              hits: 1,
              runs: 1,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 1,
              walks: 0,
              hbp: 0,
              rbi: 1
            },
            {
              order: '3.',
              pos: 'SS',
              name: 'Fernando Tatis Jr.',
              number: 23,
              atBats: 3,
              hits: 0,
              runs: 1,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 1,
              hbp: 0,
              rbi: 0
            },
            {
              order: '4.',
              pos: '3B',
              name: 'Manny Machado',
              number: 13,
              atBats: 4,
              hits: 3,
              runs: 1,
              singles: 3,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '5.',
              pos: '1B',
              name: 'Eric Hosmer',
              number: 30,
              atBats: 4,
              hits: 2,
              runs: 1,
              singles: 1,
              doubles: 1,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 2
            },
            {
              order: '6.',
              pos: 'LF',
              name: 'Tony Pham',
              number: 28,
              atBats: 3,
              hits: 1,
              runs: 0,
              singles: 0,
              doubles: 1,
              triples: 0,
              homeRuns: 0,
              walks: 1,
              hbp: 0,
              rbi: 2
            },
            {
              order: '7.',
              pos: 'CF',
              name: 'Jorge Mateo',
              number: 3,
              atBats: 4,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '8.',
              pos: 'C',
              name: 'Victor Caratini',
              number: 17,
              atBats: 2,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 1,
              hbp: 0,
              rbi: 0
            },
            {
              order: '9.',
              pos: 'P',
              name: 'Blake Snell',
              number: 4,
              atBats: 1,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'PH',
              name: 'Ha-Seong Kim',
              number: 7,
              atBats: 1,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Austin Adams',
              number: 54,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Craig Stammen',
              number: 34,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'PH',
              name: 'Trent Grisham',
              number: 0,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'PH',
              name: 'Wil Myers',
              number: 5,
              atBats: 1,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Keone Kela',
              number: 27,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Mark Melancon',
              number: 33,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            }
          ]
        },
        away: {
          team: 'lad',
          innings: [0, 2, 0, 0, 0, 0, 0, 0, 0],
          hits: 3,
          runs: 2,
          errors: 1,
          current: {
            player: {
              name: 'Betts',
              count: '2-3',
              order: '1.'
            },
            score: 2
          },
          roster: [
            {
              order: '1.',
              pos: 'RF',
              name: 'Mookie Betts',
              number: 50,
              atBats: 3,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 1,
              hbp: 0,
              rbi: 0
            },
            {
              order: '2.',
              pos: 'SS',
              name: 'Corey Seager',
              number: 22,
              atBats: 4,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '3.',
              pos: '3B',
              name: 'Justin Turner',
              number: 10,
              atBats: 3,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 1,
              hbp: 0,
              rbi: 0
            },
            {
              order: '4.',
              pos: 'C',
              name: 'Will Smith',
              number: 16,
              atBats: 4,
              hits: 1,
              runs: 1,
              singles: 1,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '5.',
              pos: 'CF',
              name: 'Chris Taylor',
              number: 3,
              atBats: 4,
              hits: 1,
              runs: 1,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 1,
              walks: 0,
              hbp: 0,
              rbi: 2
            },
            {
              order: '6.',
              pos: '1B, 2B',
              name: 'Max Muncy',
              number: 13,
              atBats: 3,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '7.',
              pos: 'LF',
              name: 'A. J. Pollock',
              number: 11,
              atBats: 3,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Scott Alexander',
              number: 75,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'LF',
              name: 'Luke Raley',
              number: 62,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '8.',
              pos: '2B',
              name: 'Sheldon Neuse',
              number: 56,
              atBats: 2,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'PH, 1B',
              name: 'Edin Ríos',
              number: 43,
              atBats: 1,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              order: '9.',
              pos: 'P',
              name: 'Trevor Bauer',
              number: 27,
              atBats: 2,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Brusdar Graterol',
              number: 48,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'LF',
              name: 'Zach McKinstry',
              number: 8,
              atBats: 1,
              hits: 1,
              runs: 0,
              singles: 1,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            },
            {
              pos: 'P',
              name: 'Dennis Santana',
              number: 77,
              atBats: 0,
              hits: 0,
              runs: 0,
              singles: 0,
              doubles: 0,
              triples: 0,
              homeRuns: 0,
              walks: 0,
              hbp: 0,
              rbi: 0
            }
          ]
        }
      },
      game: {
        outs: [true, false],
        inning: 2,
        isTop: true,
        count: '3-2',
        runners: [true, false, true],
        winningPitcher: 'Kela (2-0)',
        losingPitcher: 'Alexander (0-1)',
        save: 'Melancon (6)'
      },
      boxscoreHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'R', 'H', 'E'],
      rosterHeaders: ['POS', 'Name', '#', 'AB', 'R', 'H', '1B', '2B', '3B', 'HR', 'BB', 'HBP', 'RBI'],
      emit
    }
  }
}
</script>

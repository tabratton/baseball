import Component from '@glimmer/component';

export default class StandingsTable extends Component {
  get headers() {
    return [
      { label: '#', field: 'divisionRank' },
      { label: 'Team', field: 'team.name' },
      { label: 'W', field: 'leagueRecord.wins' },
      { label: 'L', field: 'leagueRecord.losses' },
      { label: '%', field: 'leagueRecord.pct' },
      { label: 'GB', field: 'gamesBack' },
      { label: 'WC', field: 'wildCardGamesBack' },
      { label: 'RS', field: 'runsScored' },
      { label: 'RA', field: 'runsAllowed' },
      { label: 'Δ', field: 'runDifferential' },
    ];
  }
}

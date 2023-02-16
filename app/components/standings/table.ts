import Component from '@glimmer/component';

import { MLBTeamDivision } from 'baseball/interfaces/MLBAPI/MLBDivisionStandings';
import TeamRecord from 'baseball/models/TeamRecord';

interface StandingsTableArgs {
  standings: {
    division: MLBTeamDivision | undefined;
    teamRecords: TeamRecord[];
  };
}

export default class StandingsTable extends Component<StandingsTableArgs> {
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

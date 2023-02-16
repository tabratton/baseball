import { action } from '@ember/object';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import { MLBTeamDivision } from 'baseball/interfaces/MLBAPI/MLBDivisionStandings';
import WinDifferential from 'baseball/models/WinDifferential';

interface StandingsCardArgs {
  league: {
    east: MLBTeamDivision | undefined;
    central: MLBTeamDivision | undefined;
    west: MLBTeamDivision | undefined;
  };
  diffData: WinDifferential[];
}

export default class StandingsCard extends Component<StandingsCardArgs> {
  @tracked declare selectedDivision: MLBTeamDivision | undefined;

  @cached
  get chartData() {
    const divisionId = this.selectedDivision?.id;
    return this.args.diffData.filter((d) => d.team.divisionId === divisionId);
  }

  @action
  updateSelected(team: MLBTeamDivision) {
    this.selectedDivision =
      this.selectedDivision?.id === team.id ? undefined : team;
  }
}

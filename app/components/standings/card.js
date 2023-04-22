import { action } from '@ember/object';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

export default class StandingsCard extends Component {
  @tracked selectedDivision;

  @cached
  get chartData() {
    const divisionId = this.selectedDivision?.id;
    return this.args.diffData.filter((d) => d.team.divisionId === divisionId);
  }

  @action
  updateSelected(team) {
    this.selectedDivision =
      this.selectedDivision?.id === team.id ? undefined : team;
  }
}

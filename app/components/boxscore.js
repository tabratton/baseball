import Component from '@glimmer/component';

export default class Boxscore extends Component {
  get innings() {
    return this.args.game.awayTeam.innings.map(
      (inning, index) => `${index + 1}`
    );
  }
}

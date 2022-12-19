import Component from '@glimmer/component';

import type Game from 'baseball/models/Game';

interface BoxscoreArgs {
  game: Game;
}

export default class Boxscore extends Component<BoxscoreArgs> {
  get innings() {
    return this.args.game.awayTeam.innings.map(
      (inning, index) => `${index + 1}`
    );
  }
}

import Service from '@ember/service';

import { format } from 'date-fns';
import fetch from 'fetch';

import { MLBScheduleEntry } from '../interfaces/MLBAPI/MLBScheduleEntry';
import { MLBGameFeed } from 'baseball/interfaces/MLBAPI/MLBGameFeed';
import Game from 'baseball/models/Game';
import { all } from 'rsvp';

export default class MlbApi extends Service {
  fetchGamesForDay(date: Date): Promise<Game[]> {
    return fetch(
      encodeURI(
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${format(
          date,
          'y-MM-dd'
        )}`
      )
    )
      .then((response) => {
        if (response.status !== 200) {
          return [];
        }

        return response
          .json()
          .then(({ dates: [dateData] }) => dateData?.games || []);
      })
      .then((games: MLBScheduleEntry[]) =>
        all(games.map((d: MLBScheduleEntry) => this.fetchGame(`${d.gamePk}`)))
      );
  }

  fetchGame(gamePk: string) {
    return fetch(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('could not fetch game');
        }

        return response.json().then((data: MLBGameFeed) => data);
      })
      .then((gameFeed) => new Game(gameFeed));
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'mlb-api': MlbApi;
  }
}

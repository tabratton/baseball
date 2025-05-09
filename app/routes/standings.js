import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { DateTime } from 'luxon';

export default class Standings extends Route {
  @service mlbApi;

  queryParams = {
    date: {
      refreshModel: true,
    },
  };

  async model(params) {
    const date = params.date || DateTime.now().toFormat('y-MM-dd');
    return Promise.all([
      this.mlbApi.fetchStandings(date, 'regularSeason'),
      this.mlbApi.fetchWinDifferentials(date),
    ]).then(([standings, winDifferentials]) => ({
      standings,
      winDifferentials,
    }));
  }
}

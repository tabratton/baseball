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
    return Promise.all([
      this.mlbApi.fetchStandings(
        params.date || DateTime.now().toFormat('y-MM-dd'),
        'regularSeason',
      ),
      this.mlbApi.fetchWinDifferentials(
        params.date?.split('-')[0] || DateTime.now().toFormat('y'),
      ),
    ]).then(([standings, winDifferentials]) => ({
      standings,
      winDifferentials,
    }));
  }
}

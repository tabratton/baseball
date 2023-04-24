import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { DateTime } from 'luxon';
import { hash } from 'rsvp';

export default class Standings extends Route {
  @service mlbApi;

  queryParams = {
    date: {
      refreshModel: true,
    },
  };

  async model(params) {
    return hash({
      standings: this.mlbApi.fetchStandings(
        params.date || DateTime.now().toFormat('y-MM-dd'),
        'regularSeason'
      ),
      winDifferentials: this.mlbApi.fetchWinDifferentials(
        params.date?.split('-')[0] || DateTime.now().toFormat('y')
      ),
    });
  }
}

import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { format } from 'date-fns';
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
        params.date || format(new Date(), 'y-MM-dd'),
        'regularSeason'
      ),
      winDifferentials: this.mlbApi.fetchWinDifferentials(
        params.date?.split('-')[0] || format(new Date(), 'y')
      ),
    });
  }
}

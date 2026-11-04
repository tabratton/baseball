import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Standings extends Route {
  @service mlbApi;

  queryParams = {
    date: {
      refreshModel: true,
    },
  };

  async model(params) {
    const date = params.date || Temporal.Now.plainDateISO().toString();
    const year = date.split('-')[0];
    const {
      regularSeasonStartDate,
      regularSeasonEndDate,
      postSeasonStartDate,
      postSeasonEndDate,
    } = await this.mlbApi.getSeasonData(year);
    const selectedDate = Temporal.PlainDate.from(date);
    const regularSeasonInterval = new Interval(
      Temporal.PlainDate.from(regularSeasonStartDate),
      Temporal.PlainDate.from(regularSeasonEndDate),
    );
    const postSeasonInterval = new Interval(
      Temporal.PlainDate.from(postSeasonStartDate),
      Temporal.PlainDate.from(postSeasonEndDate),
    );

    if (postSeasonInterval.contains(selectedDate)) {
      return this.mlbApi
        .fetchPostSeasonData(selectedDate)
        .then((postSeasonData) => ({
          regularSeasonInterval,
          postSeasonInterval,
          postSeason: postSeasonData,
        }))
        .catch(() => ({ postSeason: [] }));
    } else if (regularSeasonInterval.contains(selectedDate)) {
      return Promise.all([
        this.mlbApi.fetchStandings(date, 'regularSeason'),
        this.mlbApi.fetchWinDifferentials(regularSeasonStartDate, date),
      ]).then(([standings, winDifferentials]) => ({
        regularSeasonInterval,
        postSeasonInterval,
        standings,
        winDifferentials,
      }));
    } else {
      return {};
    }
  }
}

class Interval {
  date1;
  date2;

  constructor(date1, date2) {
    this.date1 = date1;
    this.date2 = date2;
  }

  contains(date) {
    const afterBegin = Temporal.PlainDate.compare(date, this.date1) >= 0;
    const beforeEnd = Temporal.PlainDate.compare(date, this.date2) <= 0;
    return afterBegin && beforeEnd;
  }
}

import Component from '@glimmer/component';

import type Batter from 'baseball/models/Batter';

interface BattersTableArgs {
  batters: Batter[];
}

export default class Batters extends Component<BattersTableArgs> {
  get headers() {
    return [
      { label: '', field: 'battingOrderSort' },
      { label: 'POS', field: 'position' },
      { label: 'Name', field: 'fullName' },
      { label: '#', field: 'number', class: 'hidden lg:table-cell' },
      { label: 'AB', field: 'atBats' },
      { label: 'H', field: 'hits' },
      { label: 'R', field: 'runs' },
      { label: 'BB', field: 'baseOnBalls' },
      { label: 'RBI', field: 'rbi' },
      { label: '1B', field: 'singles', class: 'hidden lg:table-cell' },
      { label: '2B', field: 'doubles', class: 'hidden lg:table-cell' },
      { label: '3B', field: 'triples', class: 'hidden lg:table-cell' },
      { label: 'HR', field: 'homeRuns' },
      { label: 'HBP', field: 'hitByPitch', class: 'hidden lg:table-cell' },
      { label: 'AVG', field: 'avg', class: 'hidden lg:table-cell' },
    ];
  }
}

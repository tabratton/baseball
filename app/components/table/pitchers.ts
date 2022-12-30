import Component from '@glimmer/component';

import type Pitcher from 'baseball/models/Pitcher';

interface PitchersTableArgs {
  pitchers: Pitcher[];
}

export default class Pitchers extends Component<PitchersTableArgs> {
  get headers() {
    return [
      { label: '', field: 'index' },
      { label: 'Name', field: 'fullName' },
      { label: '#', field: 'number', class: 'hidden lg:table-cell' },
      { label: 'IP', field: 'inningsPitched' },
      { label: 'H', field: 'hits' },
      { label: 'ER', field: 'earnedRuns' },
      { label: 'K', field: 'strikeOuts' },
      { label: 'BB', field: 'baseOnBalls' },
      { label: 'B/S', field: 'ballsAndStrikes', class: 'hidden lg:table-cell' },
      { label: 'ERA', field: 'era', class: 'hidden lg:table-cell' },
    ];
  }
}

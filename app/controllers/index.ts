import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import './application.css';

export default class Index extends Controller {
  @tracked selectedDate: Date = new Date();
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    index: Index;
  }
}

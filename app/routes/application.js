import Route from '@ember/routing/route';
import { service } from '@ember/service';

import formats from '../ember-intl';

export default class Application extends Route {
  @service intl;

  async beforeModel() {
    this.intl.setFormats(formats);
    const { default: translations } =
      await import('../../translations/en-us.json');
    this.intl.addTranslations('en-us', translations);
    this.intl.setLocale(['en-us']);
  }
}

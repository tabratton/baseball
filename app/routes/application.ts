import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';

import formats from '../ember-intl';

type TranslationsModule =
  typeof import('virtual:ember-intl/translations/en-us');

const translationModules: Record<string, () => Promise<TranslationsModule>> = {
  'en-us': () => import('virtual:ember-intl/translations/en-us'),
};

export default class Application extends Route {
  @service declare intl: IntlService;

  async beforeModel() {
    await this.loadTranslations('en-us');
    this.intl.setFormats(formats);
    this.intl.setLocale(['en-us']);
  }

  async loadTranslations(locale: string) {
    const loadTranslations = translationModules[locale];
    if (!loadTranslations) {
      return;
    }

    const translations = (await loadTranslations()).default;
    this.intl.addTranslations(locale, translations);
  }
}

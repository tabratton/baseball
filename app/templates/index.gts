import type { TOC } from '@ember/component/template-only';
import { fn } from '@ember/helper';
import { pageTitle } from 'ember-page-title';

import ScorebugList from '../components/scorebug-list';
import type IndexController from '../controllers/index';

<template>
  {{pageTitle "Baseball"}}

  <div class="home h-home overflow-auto w-full flex flex-col items-center">
    <ScorebugList
      class="w-full overflow-auto mb-4 flex flex-row flex-wrap gap-y-4 gap-x-2 md:justify-center p-2 md:p-4"
      @date={{@controller.selectedDate}}
      @onUpdate={{fn (mut @controller.selectedDate)}}
    />
  </div>
</template> satisfies TOC<{
  Args: { model: unknown; controller: IndexController };
}>;

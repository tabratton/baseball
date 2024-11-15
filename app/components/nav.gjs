import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';

import eq from 'ember-truth-helpers/helpers/eq';

const Tab = <template>
  <div
    class='p-4 cursor-pointer rounded-t border-2 hover:bg-stone-700 hover:border-b-stone-700 mb-[-2px] transition
      {{if
        (eq @selected @tab)
        "border-stone-50 border-b-stone-800"
        "border-transparent"
      }}'
    role='tab'
    {{on 'click' (fn @onUpdate @tab)}}
  >
    {{yield}}
  </div>
</template>;

/* eslint-disable ember/no-empty-glimmer-component-classes */
export default class Nav extends Component {
  <template>
    <div class='mt-4 border-b-2 border-stone-50 flex justify-center'>
      {{yield (hash Tab=(component Tab selected=@selected onUpdate=@onUpdate))}}
    </div>
  </template>
}

import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';

import eq from 'ember-truth-helpers/helpers/eq';

const Tab = <template>
  <div
    class="p-4 cursor-pointer rounded-t border hover:bg-stone-700 mb-[-1px] transition {{if (eq @selected @tab) "border-stone-600" "border-transparent"}}"
    role="tab"
    {{on "click" (fn @onUpdate @tab)}}
  >
    {{yield}}
  </div>
</template>

export const Nav = <template>
  <div class="mt-4 border-b border-stone-600 flex justify-center">
    {{yield (hash Tab=(component Tab selected=@selected onUpdate=@onUpdate))}}
  </div>
</template>

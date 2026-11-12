import type { TOC } from '@ember/component/template-only';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import type { WithBoundArgs } from '@glint/template';

import eq from 'ember-truth-helpers/helpers/eq';

interface TabSignature {
  Args: {
    tab: string;
    selected: string | undefined;
    onUpdate: (tab: string) => void;
  };
  Blocks: { default: [] };
}

const Tab: TOC<TabSignature> = <template>
  <div
    class="p-4 cursor-pointer rounded-t border-2 hover:bg-stone-700 hover:border-b-stone-700 mb-[-2px] transition
      {{if
        (eq @selected @tab)
        'border-stone-50 border-b-stone-800'
        'border-transparent'
      }}"
    role="tab"
    {{on "click" (fn @onUpdate @tab)}}
  >
    {{yield}}
  </div>
</template>;

interface NavSignature {
  Args: {
    selected: string | undefined;
    onUpdate: (tab: string) => void;
  };
  Blocks: {
    default: [{ Tab: WithBoundArgs<typeof Tab, 'selected' | 'onUpdate'> }];
  };
}

const Nav: TOC<NavSignature> = <template>
  <div class="mt-4 border-b-2 border-stone-50 flex justify-center">
    {{yield (hash Tab=(component Tab selected=@selected onUpdate=@onUpdate))}}
  </div>
</template>;

export default Nav;

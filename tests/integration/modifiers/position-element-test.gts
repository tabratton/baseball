import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

import positionElement from 'baseball/modifiers/position-element';

module('Integration | Modifier | position-element', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(
      <template>
        <div {{positionElement top=0 left=0}}></div>
      </template>,
    );

    assert.ok(true);
  });
});

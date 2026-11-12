import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

import gameRefresher from 'baseball/modifiers/game-refresher';

module('Integration | Modifier | game-refresher', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(
      <template>
        <div {{gameRefresher}}></div>
      </template>,
    );

    assert.ok(true);
  });
});

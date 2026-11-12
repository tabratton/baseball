import { module, test } from 'qunit';
import { setupRenderingTest } from 'baseball/tests/helpers';
import { render } from '@ember/test-helpers';

import Loading from 'baseball/components/loading';

module('Integration | Component | loading', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><Loading /></template>);

    assert.dom().hasText('');

    // Template block usage:
    await render(
      <template>
        <Loading>
          template block text
        </Loading>
      </template>,
    );

    assert.dom().hasText('template block text');
  });
});

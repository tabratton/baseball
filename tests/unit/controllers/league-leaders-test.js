import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | league-leaders', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:league-leaders');
    assert.ok(controller);
  });
});

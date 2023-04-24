import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | league-leaders', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:league-leaders');
    assert.ok(route);
  });
});

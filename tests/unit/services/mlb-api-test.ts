import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | mlb-api', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:mlb-api');
    assert.ok(service);
  });
});

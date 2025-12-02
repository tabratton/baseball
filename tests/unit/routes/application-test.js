import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import ApplicationRoute from 'baseball/routes/application';

module('Unit | Route | application', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('route:application', ApplicationRoute);
  });

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:application');
    assert.ok(route);
  });
});

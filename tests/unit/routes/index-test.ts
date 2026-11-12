import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import IndexRoute from 'baseball/routes/index';

module('Unit | Route | index', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('route:index', IndexRoute);
  });

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:index');
    assert.ok(route);
  });
});

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import LeagueLeadersRoute from 'baseball/routes/league-leaders';

module('Unit | Route | league-leaders', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('route:league-leaders', LeagueLeadersRoute);
  });

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:league-leaders');
    assert.ok(route);
  });
});

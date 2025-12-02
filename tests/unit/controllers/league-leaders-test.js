import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import LeagueLeadersController from 'baseball/controllers/league-leaders';

module('Unit | Controller | league-leaders', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('controller:league-leaders', LeagueLeadersController);
  });

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:league-leaders');
    assert.ok(controller);
  });
});

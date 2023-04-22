import getTeamConfig from 'baseball/utils/get-team-config';
import { module, test } from 'qunit';

module('Unit | Utility | get-team-config', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let result = getTeamConfig();
    assert.ok(result);
  });
});

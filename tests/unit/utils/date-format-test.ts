import dateFormat from 'baseball/utils/date-format';
import { module, test } from 'qunit';

module('Unit | Utility | date-format', function (/*hooks*/) {
  // Replace this with your real tests.
  test('it works', function (assert) {
    const result = dateFormat(new Date(), 'en-US');
    assert.ok(result);
  });
});

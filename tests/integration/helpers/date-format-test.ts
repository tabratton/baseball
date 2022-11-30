import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | date-format', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function (assert) {
    this.set('date', new Date(2022, 3, 12));
    this.set('locale', 'en-US');

    await render(hbs`{{date-format date=this.date locale=this.locale}}`);

    assert.strictEqual(this.element.textContent?.trim(), '');
  });
});

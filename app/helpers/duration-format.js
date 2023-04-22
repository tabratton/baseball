import { helper } from '@ember/component/helper';

import durationFormatUtil from 'baseball/utils/duration-format';

export default helper((params, { duration, options }) => {
  return durationFormatUtil(duration, options);
});

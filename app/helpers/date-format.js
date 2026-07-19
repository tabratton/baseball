import { helper } from '@ember/component/helper';

import dateFormatUtil from 'baseball/utils/date-format';

export function dateFormat(params, hash) {
  return dateFormatUtil(hash.date, hash.locale, hash.format);
}

export default helper((params, { date, locale, format }) =>
  dateFormatUtil(date, locale, format),
);

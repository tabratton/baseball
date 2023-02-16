import { helper } from '@ember/component/helper';

import dateFormatUtil from 'baseball/utils/date-format';

interface Params {
  date: Date;
  format: string;
  locale: string;
}

export function dateFormat(params: unknown[], hash: Params) {
  return dateFormatUtil(hash.date, hash.locale, hash.format);
}

export default helper(dateFormat);

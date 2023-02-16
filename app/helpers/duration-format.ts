import { helper } from '@ember/component/helper';

import durationFormatUtil from 'baseball/utils/duration-format';

interface Params {
  duration: Duration;
  options?: {
    format?: string[] | undefined;
    zero?: boolean | undefined;
    delimiter?: string | undefined;
    locale?: Locale | undefined;
  };
}

export function dateFormat(params: unknown[], hash: Params) {
  return durationFormatUtil(hash.duration, hash.options);
}

export default helper(dateFormat);

import { helper } from '@ember/component/helper';

export default helper(([value, defaultValue]) => value ?? defaultValue);

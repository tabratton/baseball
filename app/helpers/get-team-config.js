import { helper } from '@ember/component/helper';

import getTeamConfigUtil from 'baseball/utils/get-team-config';

export default helper(function getTeamConfig([id] /*, named*/) {
  return getTeamConfigUtil(id);
});

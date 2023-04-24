'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': {
      allow: ['date-format', 'duration-format', 'with-default'],
    },
  },
};

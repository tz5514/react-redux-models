import immutabilityHelper from 'immutability-helper'
import omit from 'lodash/omit'

immutabilityHelper.extend('$removeProperty', (propertyKey, original) => {
  return omit(original, [propertyKey]);
});

export default immutabilityHelper
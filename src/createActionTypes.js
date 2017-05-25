import isNull from 'lodash/isNull'
import forEach from 'lodash/forEach'
import flattenDeep from 'lodash/flattenDeep'

export const fetchTypes = ['REQUEST', 'SUCCESS', 'ERROR'];

export default function createActionTypes(...args) {
  let types, prefix, actionTypes = {};
  if (args.length == 1) {
    prefix = '';
    types = args[0];    
  } else if (args.length == 2) {
    prefix = `${args[0]}.`;
    types = args[1];
  } else {
    new Error('Invalid parameters');
  }

  forEach(types, (type, key) => {
    if (isNull(type)) {
      actionTypes[key] = `${prefix}${key}`;
    } else if (Array.isArray(type)) {
      actionTypes[key] = {};
      flattenDeep(type).forEach(status => {
        actionTypes[key][status] = `${prefix}${key}.${status}`
      })
    }
  });
  
  return actionTypes;
}
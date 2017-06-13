import isPlainObject from 'lodash/isPlainObject'
import forEach from 'lodash/forEach'
import flattenDeep from 'lodash/flattenDeep'

export const AJAX_ACTION_TYPES = ['REQUEST', 'SUCCESS', 'ERROR', 'CANCEL'];

export default function createActionTypes(...args) {
  let types, prefix, actionTypes = {};
  if (args.length == 1) {
    prefix = '';
    types = args[0];    
  } else if (args.length == 2) {
    prefix = `${args[0]}.`;
    types = args[1];
  } else {
    throw new Error('Invalid parameters.');
  }

  if (Array.isArray(types)) {
    return getTypesFromArray(types, prefix);
  } else if (isPlainObject(types)) {
    return getTypesFromObject(types, prefix);
  }
}

function getTypesFromArray(typesArray, prefix) {
  let actionTypes = {};
  forEach(typesArray, (type) => {
    if (typeof type == 'string') {
      actionTypes[type] = `${prefix}${type}`;
    } else if (isPlainObject(type)) {
      Object.assign(actionTypes, getTypesFromObject(type, prefix));
    }
  });
  return actionTypes;
}

function getTypesFromObject(typesObject, prefix) {
  let actionTypes = {};
  forEach(typesObject, (type, key) => {
    if (Array.isArray(type)) {
      actionTypes[key] = {};
      flattenDeep(type).forEach(status => {
        actionTypes[key][status] = `${prefix}${key}.${status}`
      })
    }
  });
  return actionTypes;
}
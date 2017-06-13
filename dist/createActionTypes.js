'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AJAX_ACTION_TYPES = undefined;
exports.default = createActionTypes;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _flattenDeep = require('lodash/flattenDeep');

var _flattenDeep2 = _interopRequireDefault(_flattenDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AJAX_ACTION_TYPES = exports.AJAX_ACTION_TYPES = ['REQUEST', 'SUCCESS', 'ERROR', 'CANCEL'];

function createActionTypes() {
  var types = void 0,
      prefix = void 0,
      actionTypes = {};
  if (arguments.length == 1) {
    prefix = '';
    types = arguments.length <= 0 ? undefined : arguments[0];
  } else if (arguments.length == 2) {
    prefix = (arguments.length <= 0 ? undefined : arguments[0]) + '.';
    types = arguments.length <= 1 ? undefined : arguments[1];
  } else {
    throw new Error('Invalid parameters.');
  }

  if (Array.isArray(types)) {
    return getTypesFromArray(types, prefix);
  } else if ((0, _isPlainObject2.default)(types)) {
    return getTypesFromObject(types, prefix);
  }
}

function getTypesFromArray(typesArray, prefix) {
  var actionTypes = {};
  (0, _forEach2.default)(typesArray, function (type) {
    if (typeof type == 'string') {
      actionTypes[type] = '' + prefix + type;
    } else if ((0, _isPlainObject2.default)(type)) {
      Object.assign(actionTypes, getTypesFromObject(type, prefix));
    }
  });
  return actionTypes;
}

function getTypesFromObject(typesObject, prefix) {
  var actionTypes = {};
  (0, _forEach2.default)(typesObject, function (type, key) {
    if (Array.isArray(type)) {
      actionTypes[key] = {};
      (0, _flattenDeep2.default)(type).forEach(function (status) {
        actionTypes[key][status] = '' + prefix + key + '.' + status;
      });
    }
  });
  return actionTypes;
}
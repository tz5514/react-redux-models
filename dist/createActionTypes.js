'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FETCH_ACTION_TYPES = undefined;
exports.default = createActionTypes;

var _isNull = require('lodash/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _flattenDeep = require('lodash/flattenDeep');

var _flattenDeep2 = _interopRequireDefault(_flattenDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FETCH_ACTION_TYPES = exports.FETCH_ACTION_TYPES = ['REQUEST', 'SUCCESS', 'ERROR'];

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

  (0, _forEach2.default)(types, function (type, key) {
    if ((0, _isNull2.default)(type)) {
      actionTypes[key] = '' + prefix + key;
    } else if (Array.isArray(type)) {
      actionTypes[key] = {};
      (0, _flattenDeep2.default)(type).forEach(function (status) {
        actionTypes[key][status] = '' + prefix + key + '.' + status;
      });
    }
  });

  return actionTypes;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_immutabilityHelper2.default.extend('$removeProperty', function (propertyKey, original) {
  return (0, _omit2.default)(original, [propertyKey]);
});

exports.default = _immutabilityHelper2.default;
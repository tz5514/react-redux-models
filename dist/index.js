'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModels = exports.registerModelAndGenerateReducer = exports.connectModel = exports.combineModelReducers = undefined;

var _combineModelReducers = require('./combineModelReducers');

var _combineModelReducers2 = _interopRequireDefault(_combineModelReducers);

var _connectModel = require('./connectModel');

var _connectModel2 = _interopRequireDefault(_connectModel);

var _modelCollection = require('./modelCollection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.combineModelReducers = _combineModelReducers2.default;
exports.connectModel = _connectModel2.default;
exports.registerModelAndGenerateReducer = _modelCollection.registerModelAndGenerateReducer;
exports.getModels = _modelCollection.getModels;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchTypes = exports.createActionTypes = exports.createStoreAndConnectModel = exports.connectModel = exports.getModels = exports.registerModelAndGenerateReducer = exports.combineModelReducers = undefined;

var _modelCollection = require('./modelCollection');

var _combineModelReducers = require('./combineModelReducers');

var _combineModelReducers2 = _interopRequireDefault(_combineModelReducers);

var _connectModel = require('./connectModel');

var _connectModel2 = _interopRequireDefault(_connectModel);

var _createStoreAndConnectModel = require('./createStoreAndConnectModel');

var _createStoreAndConnectModel2 = _interopRequireDefault(_createStoreAndConnectModel);

var _createActionTypes = require('./createActionTypes');

var _createActionTypes2 = _interopRequireDefault(_createActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.combineModelReducers = _combineModelReducers2.default;
exports.registerModelAndGenerateReducer = _modelCollection.registerModelAndGenerateReducer;
exports.getModels = _modelCollection.getModels;
exports.connectModel = _connectModel2.default;
exports.createStoreAndConnectModel = _createStoreAndConnectModel2.default;
exports.createActionTypes = _createActionTypes2.default;
exports.fetchTypes = _createActionTypes.fetchTypes;
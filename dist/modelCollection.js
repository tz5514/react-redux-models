'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerModel = registerModel;
exports.getModels = getModels;

var _combineModelReducers = require('./combineModelReducers');

var _combineModelReducers2 = _interopRequireDefault(_combineModelReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = {};

function registerModel() {
  for (var _len = arguments.length, pendingModels = Array(_len), _key = 0; _key < _len; _key++) {
    pendingModels[_key] = arguments[_key];
  }

  pendingModels.forEach(function (model) {
    models[model.modelName] = model;
  });
}

function getModels() {
  return models;
}
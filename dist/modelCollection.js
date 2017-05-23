"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModels = getModels;
exports.registerModelAndGenerateReducer = registerModelAndGenerateReducer;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

function registerModelAndGenerateReducer(_ref) {
  var models = _ref.models,
      generateReducer = _ref.generateReducer;

  registerModel.apply(undefined, _toConsumableArray(models));
  return generateReducer();
}
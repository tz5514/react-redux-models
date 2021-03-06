'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;
exports.getComputedValues = getComputedValues;

var _redux = require('redux');

var _combineModelReducers = require('./combineModelReducers');

var _combineModelReducers2 = _interopRequireDefault(_combineModelReducers);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createStore(_ref) {
  var models = _ref.models,
      reducerStructure = _ref.reducerStructure,
      _ref$enhancer = _ref.enhancer,
      enhancer = _ref$enhancer === undefined ? function (func) {
    return func;
  } : _ref$enhancer,
      initialState = _ref.initialState;

  var modelIntances = getInitialModelInstances(models);
  var reducer = (0, _combineModelReducers2.default)(modelIntances, reducerStructure);
  var store = (0, _redux.createStore)(reducer, initialState, enhancer);

  // bindActions
  for (var modelName in modelIntances) {
    modelIntances[modelName].bindActions(store.dispatch);
  }

  store.getActions = getActions.bind(null, modelIntances);
  store.getComputedValues = getComputedValues.bind(null, modelIntances);

  // importActions
  for (var _modelName in modelIntances) {
    modelIntances[_modelName].importActions(store.getActions);
  }

  store.models = modelIntances;

  for (var _modelName2 in store.models) {
    store.models[_modelName2].getState = store.getState;
    Object.defineProperty(store.models[_modelName2], 'state', { get: store.getState });
  }

  return store;
}

function getInitialModelInstances(models) {
  return (0, _mapValues2.default)(models, function (Model) {
    return new Model();
  });
}

function getActions(models, actionOptions) {
  var modelActions = (0, _map2.default)(actionOptions, function (neededActionNames, modelName) {
    if (!models[modelName]) {
      throw new Error('Model "' + modelName + '" was undefined.');
    }

    if (!models[modelName].actions) {
      return {};
    }

    var currentModelActions = models[modelName].getOriginalActions();

    if (neededActionNames === 'all') {
      return currentModelActions;
    } else if (Array.isArray(neededActionNames)) {
      var currentModelActionNames = Object.keys(currentModelActions);
      neededActionNames.forEach(function (actionName) {
        if (!currentModelActionNames.includes(actionName)) {
          throw new Error('action "' + actionName + '" of model "' + modelName + '" was undefined.');
        }
      });
      return (0, _pickBy2.default)(currentModelActions, function (val, actionName) {
        return neededActionNames.includes(actionName);
      });
    } else {
      throw new Error('Options for needed actions of model "' + modelName + '" was invalid. It should be a string \'all\', or an array of action names.');
    }
  });

  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(modelActions)));
}

function getComputedValues(models, computedValueOptions) {
  var modelComputedValues = (0, _map2.default)(computedValueOptions, function (neededComputedValueNames, modelName) {
    if (!models[modelName]) {
      throw new Error('Model "' + modelName + '" was undefined.');
    }

    if (!models[modelName].computedValues) {
      return {};
    }

    var currentModelComputedValues = models[modelName].computedValues;

    if (neededComputedValueNames === 'all') {
      return currentModelComputedValues;
    } else if (Array.isArray(neededComputedValueNames)) {
      var currentModelComputedValueNames = Object.keys(currentModelComputedValues);
      neededComputedValueNames.forEach(function (computedValueName) {
        if (!currentModelComputedValueNames.includes(computedValueName)) {
          throw new Error('computedValue "' + computedValueName + '" of model "' + modelName + '" was undefined.');
        }
      });
      return (0, _pickBy2.default)(currentModelComputedValues, function (val, computedValueName) {
        return neededComputedValueNames.includes(computedValueName);
      });
    } else {
      throw new Error('Options for needed computedValues of model "' + modelName + '" was invalid. It should be a string \'all\', or an array of computedValue names.');
    }
  });

  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(modelComputedValues)));
}
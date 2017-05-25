'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectModel;
exports.getCombinedActions = getCombinedActions;
exports.getCombinedComputedValues = getCombinedComputedValues;

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _modelCollection = require('./modelCollection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectModel(_ref) {
  var stateSelector = _ref.stateSelector,
      actions = _ref.actions,
      computedValues = _ref.computedValues,
      _ref$alwaysMixinDispa = _ref.alwaysMixinDispatch,
      alwaysMixinDispatch = _ref$alwaysMixinDispa === undefined ? false : _ref$alwaysMixinDispa;

  var connectParams = [];
  var models = (0, _modelCollection.getModels)();

  var actionOptions = actions;
  var computedValueOptions = computedValues;

  // actions    
  if ((0, _isPlainObject2.default)(actionOptions) && !(0, _isEmpty2.default)(actionOptions)) {
    var combinedActions = getCombinedActions(actionOptions);

    // generate mapDispatchToProps function from combinedActions
    connectParams[1] = function (dispatch) {
      var dispatchObject = alwaysMixinDispatch ? { dispatch: dispatch } : {};
      return Object.assign(dispatchObject, { actions: (0, _redux.bindActionCreators)(combinedActions, dispatch) });
    };
  }

  // computedValues
  if ((0, _isPlainObject2.default)(computedValueOptions) && !(0, _isEmpty2.default)(computedValueOptions)) {
    var combinedComputedValues = getCombinedComputedValues(computedValueOptions);

    connectParams[0] = function (state) {
      var reselectedComputedValues = (0, _mapValues2.default)(combinedComputedValues, function (computedValue) {
        return (0, _reselect.createSelector)(computedValue.selectors, computedValue.compute)(state);
      });

      return stateSelector ? Object.assign({}, stateSelector(state), reselectedComputedValues) : reselectedComputedValues;
    };
  } else {
    connectParams[0] = stateSelector;
  }

  return _reactRedux.connect.apply(undefined, connectParams);
}

function getCombinedActions(actionOptions) {
  var models = (0, _modelCollection.getModels)();
  var modelActionsObject = (0, _mapValues2.default)(actionOptions, function (neededActionNames, modelName) {
    if (!models[modelName]) {
      throw new Error('Model "' + modelName + '" was undefined.');
    }

    if (!models[modelName].actions) {
      throw new Error('actions of model "' + modelName + '" was undefined.');
    }

    var currentModelActions = models[modelName].actions;

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
      throw new Error('Input for needed actions of model "' + modelName + '" was invalid. It should be a string \'all\', or an array of action names.');
    }
  });

  var combinedActions = reduceObjectAndMerge(modelActionsObject);
  // console.log(combinedActions);

  return combinedActions;
}

function getCombinedComputedValues(computedValueOptions) {
  var models = (0, _modelCollection.getModels)();
  var modelComputedValuesObject = (0, _mapValues2.default)(computedValueOptions, function (neededComputedValueNames, modelName) {
    if (!models[modelName]) {
      throw new Error('Model "' + modelName + '" was undefined.');
    }

    if (!models[modelName].computedValues) {
      throw new Error('computedValues of model "' + modelName + '" was undefined.');
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
      throw new Error('Input for needed computedValues of model "' + modelName + '" was invalid. It should be a string \'all\', or an array of computedValue names.');
    }
  });

  var combinedComputedValues = reduceObjectAndMerge(modelComputedValuesObject);
  // console.log(combinedComputedValues);

  return combinedComputedValues;
}

function reduceObjectAndMerge(object) {
  return (0, _reduce2.default)(object, function (prev, current) {
    return Object.assign({}, prev, current);
  }, {});
}
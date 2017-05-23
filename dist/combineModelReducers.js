'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineModelReducers;

var _redux = require('redux');

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _modelCollection = require('./modelCollection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function combineModelReducers(object) {
  var models = (0, _modelCollection.getModels)();
  var transformedReducers = (0, _mapValues2.default)(object, function (value, key) {
    if (typeof value == 'string') {
      var modelName = value;
      var model = models[modelName];

      if (!model) {
        throw new Error('Model "' + modelName + '" was undefined.');
      }

      if (!model.initialState || !model.reducers) {
        throw new Error('Model "' + modelName + '" muse has declared initialState and reducers.');
      }

      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : model.initialState;
        var action = arguments[1];

        var reducerFunction = model.reducers[action.type];
        return reducerFunction ? reducerFunction(state, action) : state;
      };
    } else if (typeof value == 'function') {
      return value;
    } else if ((0, _isPlainObject2.default)(value)) {
      return combineModelReducers(value);
    } else {
      throw new Error("The object's each value must be a modelName string or reducer function, or a nested object structure.");
    }
  });

  return (0, _redux.combineReducers)(transformedReducers);
}
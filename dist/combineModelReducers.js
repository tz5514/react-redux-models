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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function combineModelReducers(modelIntances, reducerStructure) {
  var transformedReducers = (0, _mapValues2.default)(reducerStructure, function (value, key) {
    if (typeof value == 'string') {
      var modelName = value;
      var modelIntance = modelIntances[modelName];

      if (!modelIntance) {
        throw new Error('Model "' + modelName + '" was undefined.');
      }

      if (!modelIntance.reducers) {
        return function (state) {
          return state;
        };
      } else if (!modelIntance.initialState) {
        throw new Error('Model "' + modelName + '" must has declared initialState for reducers.');
      }

      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : modelIntance.initialState;
        var action = arguments[1];

        var reducerFunction = modelIntance.reducers[action.type];
        var result = reducerFunction ? reducerFunction(state, action) : state;
        return result ? result : state;
      };
    } else if (typeof value == 'function') {
      return value;
    } else if ((0, _isPlainObject2.default)(value)) {
      return combineModelReducers(modelIntances, value);
    } else {
      throw new Error("Each property value of reducerStructure object must be a modelName string or a reducer function, or a nested object structure.");
    }
  });

  return (0, _redux.combineReducers)(transformedReducers);
}
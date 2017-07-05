import { combineReducers } from 'redux'
import mapValues from 'lodash/mapValues'
import isPlainObject from 'lodash/isPlainObject'

export default function combineModelReducers(modelIntances, reducerStructure) {
  const transformedReducers = mapValues(reducerStructure, (value, key) => {
    if (typeof value == 'string') {
      const modelName = value;
      const modelIntance = modelIntances[modelName];

      if (!modelIntance) {
        throw new Error(`Model "${modelName}" was undefined.`);
      }

      if (typeof modelIntance.reducers == 'undefined') {
        return (state) => state;
      } else if (typeof modelIntance.initialState == 'undefined') {
        throw new Error(`Model "${modelName}" must has declared initialState for reducers.`);
      }

      return (state = modelIntance.initialState, action) => {
        const reducerFunction = modelIntance.reducers[action.type];
        const result = (reducerFunction)? reducerFunction(state, action) : state;
        return (result) ? result : state;
      }
    } else if (typeof value == 'function') {
      return value;
    } else if (isPlainObject(value)) {
      return combineModelReducers(modelIntances, value);
    } else {
      throw new Error("Each property value of reducerStructure object must be a modelName string or a reducer function, or a nested object structure.");
    }
  });

  return combineReducers(transformedReducers);
}
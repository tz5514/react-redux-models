import { combineReducers } from 'redux'
import mapValues from 'lodash/mapValues'
import isPlainObject from 'lodash/isPlainObject'

import { getModels } from './modelCollection'

export default function combineModelReducers(object) {
  const models = getModels();
  const transformedReducers = mapValues(object, (value, key) => {
    if (typeof value == 'string') {
      const modelName = value;
      const model = models[modelName];

      if (!model) {
        throw new Error(`Model "${modelName}" was undefined.`);
      }

      if (!model.initialState || !model.reducers) {
        throw new Error(`Model "${modelName}" muse has declared initialState and reducers.`);
      }

      return (state = model.initialState, action) => {
        const reducerFunction = model.reducers[action.type];
        return (reducerFunction)? reducerFunction(state, action) : state;
      }
    } else if (typeof value == 'function'){
      return value;
    } else if (isPlainObject(value)) {
      return combineModelReducers(value);
    } else {
      throw new Error("The object's each value must be a modelName string or reducer function, or a nested object structure.");
    }
  });

  return combineReducers(transformedReducers);
}
import { createStore as reudxCreateStore, bindActionCreators } from 'redux'
import combineModelReducers from './combineModelReducers'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import forEach from 'lodash/forEach'
import pickBy from 'lodash/pickBy'

export default function createStore({ models, reducerStructure, enhancer = (func) => func, initialState }) {
  let modelIntances = getInitialModelInstances(models);
  const reducer = combineModelReducers(modelIntances, reducerStructure);
  let store = reudxCreateStore(reducer, initialState, enhancer);

  // bindActions
  for (let modelName in modelIntances) {
    modelIntances[modelName].bindActions(store.dispatch)
  }

  store.getActions = getActions.bind(null, modelIntances);
  store.getComputedValues = getComputedValues.bind(null, modelIntances);
  
  // importActions
  for (let modelName in modelIntances) {
    modelIntances[modelName].importActions(store.getActions);
  }

  store.models = modelIntances;

  for (let modelName in store.models) {
    store.models[modelName].getState = store.getState;
    Object.defineProperty(store.models[modelName], 'state', { get: store.getState });
  }
  
  return store;
}

function getInitialModelInstances(models) {
  return mapValues(models, Model => new Model());
}

function getActions(models, actionOptions) {
  const modelActions = map(actionOptions, (neededActionNames, modelName) => {
    if (!models[modelName]) {
      throw new Error(`Model "${modelName}" was undefined.`);
    }

    if (!models[modelName].actions) {
      return {};
    }

    const currentModelActions = models[modelName].getOriginalActions();

    if (neededActionNames === 'all') {
      return currentModelActions;
    } else if (Array.isArray(neededActionNames)) {
      const currentModelActionNames = Object.keys(currentModelActions);
      neededActionNames.forEach(actionName => {
        if (!currentModelActionNames.includes(actionName)){
          throw new Error(`action "${actionName}" of model "${modelName}" was undefined.`);
        }
      });
      return pickBy(currentModelActions, (val, actionName) => neededActionNames.includes(actionName));
    } else {
      throw new Error(`Options for needed actions of model "${modelName}" was invalid. It should be a string 'all', or an array of action names.`);
    }
  });

  return Object.assign({}, ...modelActions);
}

export function getComputedValues(models, computedValueOptions) {
  const modelComputedValues = map(computedValueOptions, (neededComputedValueNames, modelName) => {
    if (!models[modelName]) {
      throw new Error(`Model "${modelName}" was undefined.`);
    }

    if (!models[modelName].computedValues) {
      return {};
    }

    const currentModelComputedValues = models[modelName].computedValues;

    if (neededComputedValueNames === 'all') {
      return currentModelComputedValues;
    } else if (Array.isArray(neededComputedValueNames)) {
      const currentModelComputedValueNames = Object.keys(currentModelComputedValues);
      neededComputedValueNames.forEach(computedValueName => {
        if (!currentModelComputedValueNames.includes(computedValueName)){
          throw new Error(`computedValue "${computedValueName}" of model "${modelName}" was undefined.`);
        }
      });
      return pickBy(currentModelComputedValues, (val, computedValueName) => neededComputedValueNames.includes(computedValueName));
    } else {
      throw new Error(`Options for needed computedValues of model "${modelName}" was invalid. It should be a string 'all', or an array of computedValue names.`);
    }
  });

  return Object.assign({}, ...modelComputedValues);
}
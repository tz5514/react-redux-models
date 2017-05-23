import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import pickBy from 'lodash/pickBy'
import mapValues from 'lodash/mapValues'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import reduce from 'lodash/reduce'

import { getModels } from './modelCollection'

function reduceObjectAndMerge(object) {
  return reduce(object, (prev, current) => Object.assign({}, prev, current), {});
}

export default function connectModel({ stateSelector, actions, computedValues, alwaysMixinDispatch = false }) {
  let connectParams = [];
  const models = getModels();

  const actionOptions = actions;
  const computedValueOptions = computedValues;

  // actions    
  if (isPlainObject(actionOptions) && !isEmpty(actionOptions)) {
    const modelActionsObject = mapValues(actionOptions, (neededActionNames, modelName) => {
      if (!models[modelName]) {
        throw new Error(`Model "${modelName}" was undefined.`);
      }

      if (!models[modelName].actions) {
        throw new Error(`actions of model "${modelName}" was undefined.`);
      }

      const currentModelActions = models[modelName].actions;

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
        throw new Error(`Input for needed actions of model "${modelName}" was invalid. It should be a string 'all', or an array of action names.`);
      }
    })
    
    const combinedActions = reduceObjectAndMerge(modelActionsObject);
    // console.log(combinedActions);

    // generate mapDispatchToProps function from combinedActions
    connectParams[1] = (dispatch) => {
      const dispatchObject = (alwaysMixinDispatch)? { dispatch } : {};
      return Object.assign(dispatchObject, { actions: bindActionCreators(combinedActions, dispatch) })
    }; 
  }

  // computedValues
  if (isPlainObject(computedValueOptions) && !isEmpty(computedValueOptions)) {
    const modelComputedValuesObject = mapValues(computedValueOptions, (neededComputedValueNames, modelName) => {
      if (!models[modelName]) {
        throw new Error(`Model "${modelName}" was undefined.`);
      }

      if (!models[modelName].computedValues) {
        throw new Error(`computedValues of model "${modelName}" was undefined.`);
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
        throw new Error(`Input for needed computedValues of model "${modelName}" was invalid. It should be a string 'all', or an array of computedValue names.`);
      }
    });

    const combinedComputedValues = reduceObjectAndMerge(modelComputedValuesObject);
    // console.log(combinedComputedValues);

    connectParams[0] = (state) => {
      const reselectedComputedValues = mapValues(
        combinedComputedValues, 
        (computedValue) => createSelector(computedValue.selectors, computedValue.compute)(state)
      );
      
      return Object.assign({}, stateSelector(state), reselectedComputedValues);
    }
  } else {
    connectParams[0] = stateSelector;
  }

  return connect(...connectParams);
}

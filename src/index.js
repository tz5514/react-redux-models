import { registerModelAndGenerateReducer, getModels } from './modelCollection'
import combineModelReducers from './combineModelReducers'
import connectModel, { getCombinedActions, getCombinedComputedValues } from './connectModel'
import createStoreAndConnectModel from './createStoreAndConnectModel'
import createActionTypes from './createActionTypes'

export {
  combineModelReducers,
  registerModelAndGenerateReducer,
  getModels,
  connectModel,  
  createStoreAndConnectModel,
  createActionTypes
}
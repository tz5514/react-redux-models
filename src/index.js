import { registerModel, getModels } from './modelCollection'
import combineModelReducers from './combineModelReducers'
import connectModel from './connectModel'
import createStoreAndConnectModel from './createStoreAndConnectModel'
import createActionTypes, { FETCH_ACTION_TYPES } from './createActionTypes'

export {
  registerModel,
  getModels,

  combineModelReducers,
  
  connectModel, 
  createStoreAndConnectModel,

  createActionTypes,
  FETCH_ACTION_TYPES
}
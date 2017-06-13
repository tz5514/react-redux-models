import { bindActionCreators } from 'redux'
import map from 'lodash/map'
import pickBy from 'lodash/pickBy'

export default class Model {
  static importActions = {}
  initialState = {}
  actions = {}
  reducers = {}

  originalActionList = []

  bindActions(dispatch) {
    const actionCreators = this.actions;
    this.originalActionList = Object.keys(actionCreators);
    this.actions = bindActionCreators(this.actions, dispatch);
    for (let actionName in this.actions) {
      this.actions[actionName].creator = actionCreators[actionName];
    }
  }

  importActions(getActions) {
    const importOptions = this.constructor.importActions;
    if (importOptions) {
      Object.assign(this.actions, getActions(importOptions));
    }    
  }

  getOriginalActions() {
    return pickBy(this.actions, (action, key) => this.originalActionList.includes(key));
  }
}
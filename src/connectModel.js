import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect as reduxConnect } from 'react-redux'
import { createSelector } from 'reselect'
import hoistNonReactStatic from 'hoist-non-react-statics'

import pickBy from 'lodash/pickBy'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'

const connectModel = (options) => (WrappedComponent) => {
  class ConnectModel extends React.PureComponent {
    static contextTypes = {
      store: PropTypes.object
    }

    ConnectWrapper = connect({
      ...options, 
      store: this.context.store 
    })(WrappedComponent)

    render() {
      return (
        <this.ConnectWrapper {...this.props}/>
      )
    }
  }

  hoistNonReactStatic(ConnectModel, WrappedComponent);
  return ConnectModel;
}
  

export function connect({ 
  store, 
  stateSelector, 
  actions: actionOptions, 
  computedValues: computedValueOptions, 
  importDispatch = false 
}) {
  let connectParams = [];
  
  // actions    
  if (isPlainObject(actionOptions) && !isEmpty(actionOptions)) {
    // generate mapDispatchToProps function from combinedActions
    connectParams[1] = (dispatch) => {
      const dispatchObject = (importDispatch)? { dispatch } : {};
      return Object.assign(dispatchObject, { actions: store.getActions(actionOptions) })
    }; 
  } else {
    connectParams[1] = (dispatch) => {
      return (importDispatch)? { dispatch } : {};
    }; 
  }

  // computedValues
  if (isPlainObject(computedValueOptions) && !isEmpty(computedValueOptions)) {
    connectParams[0] = (state) => {
      const reselectedComputedValues = mapValues(
        store.getComputedValues(computedValueOptions),
        (computedValue) => createSelector(computedValue.selectors, computedValue.compute)(state)
      );
      
      return (stateSelector) ? Object.assign({}, stateSelector(state), reselectedComputedValues) : reselectedComputedValues;
    }
  } else {
    connectParams[0] = stateSelector;
  }

  return reduxConnect(...connectParams);
}

export default connectModel;


import React from 'react'
import { bindActionCreators } from 'redux'
import { Provider } from 'react-redux'
import connectModel, { getCombinedActions } from './connectModel'

import pickBy from 'lodash/pickBy'

let memoizedStore;
let _debug = false;
const skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];

function initStore(makeStore, req, initialState) {
  // Always make a new store if server
  if (!!req && typeof window === 'undefined') {
    if (!req._store) {
      req._store = makeStore(initialState);
    }
    return req._store;
  }

  // Memoize store if client
  if (!memoizedStore) {
    memoizedStore = makeStore(initialState);
  }

  return memoizedStore;
}

export default function nextPageConnectModel(options) {
  return (Cmp) => {
    const { createStore, actions } = options;
    
    // Since provide should always be after connect we connect here
    let ConnectedCmp = connectModel(options)(Cmp);

    function WrappedCmp(props = {}) {      
      let { initialState = {}, initialProps = {}, store } = props;
      const hasStore = store && store.dispatch && store.getState;
      store = (hasStore)? store : initStore(createStore, {}, initialState); // client case, no store but has initialState

      if (_debug) {
        console.log(Cmp.name, '- 4. WrappedCmp.render', (hasStore ? 'picked up existing one,' : 'created new store with'), 'initialState', initialState);
      } 

      // Fix for _document
      let mergedProps = pickBy(props, (value, key) => !skipMerge.includes(key));
      Object.assign(mergedProps, initialProps);
      
      //FIXME This will create double Provider for _document case
      return (
        <Provider store={store}>  
          <ConnectedCmp {...mergedProps}/>
        </Provider>
      );
    }

    WrappedCmp.getInitialProps = (ctx = {}) => {
      return new Promise((resolve) => {
        if (_debug) {
          console.log(Cmp.name, '- 1. WrappedCmp.getInitialProps wrapper', (ctx.req && ctx.req._store ? 'takes the req store' : 'creates the store'));
        } 

        ctx.isServer = !!ctx.req;
        ctx.store = initStore(createStore, ctx.req);
        ctx.actions = bindActionCreators(getCombinedActions(actions), ctx.store.dispatch);

        resolve(Promise.all([
          ctx.isServer,
          ctx.store,
          ctx.req,
          Cmp.getInitialProps ? Cmp.getInitialProps.call(Cmp, ctx) : {}
        ]));

      }).then(([isServer, store, req, initialProps = {}]) => {
        if (_debug) {
          console.log(Cmp.name, '- 3. WrappedCmp.getInitialProps has store state', store.getState());
        }
        
        return {
          isServer,
          store,
          initialProps,
          initialState: store.getState(),
        };
      });
    };

    return WrappedCmp;
  };
};

export function setDebug(debug) {
  _debug = debug;
};

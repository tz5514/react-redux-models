import { PureComponent } from 'react'
import { Provider } from 'react-redux'
import pickBy from 'lodash/pickBy'

let memoizedStore;
const skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];

function initStore(createStore, req, initialState) {
  // Always make a new store if server
  if (!!req && typeof window === 'undefined') {
    if (!req._store) {
      req._store = createStore(initialState);
    }
    return req._store;
  }

  // Memoize store if client
  if (!memoizedStore) {
    memoizedStore = createStore(initialState);
  }

  return memoizedStore;
}

const wrapProvider = (createStore) => (WrappedComponent) => class WrapProvider extends PureComponent {
  static async getInitialProps(ctx = {}) {
    ctx.isServer = !!ctx.req;
    ctx.store = initStore(createStore, ctx.req);
    return {
      initialProps: (WrappedComponent.getInitialProps)? (await WrappedComponent.getInitialProps(ctx)) : {},
      initialState: ctx.store.getState()
    }
  }
  
  render() {
    let { initialState = {}, initialProps = {}, store } = this.props;
    const hasStore = store && store.dispatch && store.getState;
    store = (hasStore)? store : initStore(createStore, {}, initialState); // client case, no store but has initialState

    // Fix for _document
    let mergedProps = pickBy(this.props, (value, key) => !skipMerge.includes(key));
    Object.assign(mergedProps, initialProps);
    
    return (
      <Provider store={store}>  
        <WrappedComponent {...mergedProps}/>
      </Provider>
    );
  }
}

export default wrapProvider
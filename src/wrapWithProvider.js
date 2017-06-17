import { PureComponent } from 'react'
import { Provider } from 'react-redux'
import pickBy from 'lodash/pickBy'
import createStore from './createStore'

let memorizedStore;
const skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];

const wrapWithProvider = (storeOptions) => (WrappedComponent) => class WrapWithProvider extends PureComponent {
  static async getInitialProps(ctx = {}) {
    ctx.isServer = !!ctx.req;
    ctx.store = initStore(storeOptions, ctx.req);
    const initialProps = (WrappedComponent.getInitialProps)? (await WrappedComponent.getInitialProps(ctx)) : {};

    return {
      initialProps: (WrappedComponent.getInitialProps)? (await WrappedComponent.getInitialProps(ctx)) : {},
      initialState: ctx.store.getState(),
      store: ctx.store,
      isServer: ctx.isServer
    }
  }
  
  render() {
    let { initialState = {}, initialProps = {}, store } = this.props;
    const hasStore = Boolean(store && store.dispatch && store.getState);
    store = (hasStore)? store : initStore(storeOptions, {}, initialState); // client case, no store but has initialState

    let mergedProps = pickBy(this.props, (value, key) => !skipMerge.includes(key));
    Object.assign(mergedProps, initialProps);
    
    return (
      <Provider store={store}>  
        <WrappedComponent {...mergedProps}/>
      </Provider>
    );
  }
}

export default wrapWithProvider


function initStore(storeOptions, req, initialState) {
  // Always create a new store if env is server
  if (!!req && typeof window === 'undefined') {
    if (!req._store) {
      req._store = createStore({ ...storeOptions, initialState });
    }
    return req._store;
  }

  // Memorize store if env is client
  if (!memorizedStore) {
    memorizedStore = createStore({ ...storeOptions, initialState });
  }

  return memorizedStore;
}

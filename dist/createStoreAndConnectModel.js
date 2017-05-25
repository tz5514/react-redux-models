'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = nextPageConnectModel;
exports.setDebug = setDebug;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _connectModel = require('./connectModel');

var _connectModel2 = _interopRequireDefault(_connectModel);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memoizedStore = void 0;
var _debug = false;
var skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];

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

function nextPageConnectModel(options) {
  return function (Cmp) {
    var createStore = options.createStore,
        actions = options.actions;

    // Since provide should always be after connect we connect here

    var ConnectedCmp = (0, _connectModel2.default)(options)(Cmp);

    function WrappedCmp() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _props$initialState = props.initialState,
          initialState = _props$initialState === undefined ? {} : _props$initialState,
          _props$initialProps = props.initialProps,
          initialProps = _props$initialProps === undefined ? {} : _props$initialProps,
          store = props.store;

      var hasStore = store && store.dispatch && store.getState;
      store = hasStore ? store : initStore(createStore, {}, initialState); // client case, no store but has initialState

      if (_debug) {
        console.log(Cmp.name, '- 4. WrappedCmp.render', hasStore ? 'picked up existing one,' : 'created new store with', 'initialState', initialState);
      }

      // Fix for _document
      var mergedProps = (0, _pickBy2.default)(props, function (value, key) {
        return !skipMerge.includes(key);
      });
      Object.assign(mergedProps, initialProps);

      //FIXME This will create double Provider for _document case
      return _react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(ConnectedCmp, mergedProps)
      );
    }

    WrappedCmp.getInitialProps = function () {
      var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve) {
        if (_debug) {
          console.log(Cmp.name, '- 1. WrappedCmp.getInitialProps wrapper', ctx.req && ctx.req._store ? 'takes the req store' : 'creates the store');
        }

        ctx.isServer = !!ctx.req;
        ctx.store = initStore(createStore, ctx.req);
        ctx.actions = (0, _redux.bindActionCreators)((0, _connectModel.getCombinedActions)(actions), ctx.store.dispatch);

        resolve(Promise.all([ctx.isServer, ctx.store, ctx.req, Cmp.getInitialProps ? Cmp.getInitialProps.call(Cmp, ctx) : {}]));
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 4),
            isServer = _ref2[0],
            store = _ref2[1],
            req = _ref2[2],
            _ref2$ = _ref2[3],
            initialProps = _ref2$ === undefined ? {} : _ref2$;

        if (_debug) {
          console.log(Cmp.name, '- 3. WrappedCmp.getInitialProps has store state', store.getState());
        }

        return {
          isServer: isServer,
          store: store,
          initialProps: initialProps,
          initialState: store.getState()
        };
      });
    };

    return WrappedCmp;
  };
};

function setDebug(debug) {
  _debug = debug;
};
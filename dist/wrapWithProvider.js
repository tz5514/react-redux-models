'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var memorizedStore = void 0;
var skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];

var wrapWithProvider = function wrapWithProvider(storeOptions) {
  return function (WrappedComponent) {
    return function (_React$PureComponent) {
      _inherits(WrapWithProvider, _React$PureComponent);

      function WrapWithProvider() {
        _classCallCheck(this, WrapWithProvider);

        return _possibleConstructorReturn(this, (WrapWithProvider.__proto__ || Object.getPrototypeOf(WrapWithProvider)).apply(this, arguments));
      }

      _createClass(WrapWithProvider, [{
        key: 'render',
        value: function render() {
          var _props = this.props,
              _props$initialState = _props.initialState,
              initialState = _props$initialState === undefined ? {} : _props$initialState,
              _props$initialProps = _props.initialProps,
              initialProps = _props$initialProps === undefined ? {} : _props$initialProps,
              store = _props.store;

          var hasStore = Boolean(store && store.dispatch && store.getState);
          store = hasStore ? store : initStore(storeOptions, {}, initialState); // client case, no store but has initialState

          var mergedProps = (0, _pickBy2.default)(this.props, function (value, key) {
            return !skipMerge.includes(key);
          });
          Object.assign(mergedProps, initialProps);

          return _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(WrappedComponent, mergedProps)
          );
        }
      }], [{
        key: 'getInitialProps',
        value: function () {
          var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
            var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    ctx.isServer = !!ctx.req;
                    ctx.store = initStore(storeOptions, ctx.req);

                    if (!WrappedComponent.getInitialProps) {
                      _context.next = 8;
                      break;
                    }

                    _context.next = 5;
                    return WrappedComponent.getInitialProps(ctx);

                  case 5:
                    _context.t0 = _context.sent;
                    _context.next = 9;
                    break;

                  case 8:
                    _context.t0 = {};

                  case 9:
                    _context.t1 = _context.t0;
                    _context.t2 = ctx.store.getState();
                    _context.t3 = ctx.store;
                    _context.t4 = ctx.isServer;
                    return _context.abrupt('return', {
                      initialProps: _context.t1,
                      initialState: _context.t2,
                      store: _context.t3,
                      isServer: _context.t4
                    });

                  case 14:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function getInitialProps() {
            return _ref.apply(this, arguments);
          }

          return getInitialProps;
        }()
      }]);

      return WrapWithProvider;
    }(_react2.default.PureComponent);
  };
};

exports.default = wrapWithProvider;


function initStore(storeOptions, req, initialState) {
  // Always create a new store if env is server
  if (!!req && typeof window === 'undefined') {
    if (!req._store) {
      req._store = (0, _createStore2.default)(_extends({}, storeOptions, { initialState: initialState }));
    }
    return req._store;
  }

  // Memorize store if env is client
  if (!memorizedStore) {
    memorizedStore = (0, _createStore2.default)(_extends({}, storeOptions, { initialState: initialState }));
  }

  return memorizedStore;
}
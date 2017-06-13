'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _reactRedux = require('react-redux');

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var memoizedStore = void 0;
var skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];

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

var wrapProvider = function wrapProvider(createStore) {
  return function (WrappedComponent) {
    return function (_PureComponent) {
      _inherits(WrapProvider, _PureComponent);

      function WrapProvider() {
        _classCallCheck(this, WrapProvider);

        return _possibleConstructorReturn(this, (WrapProvider.__proto__ || Object.getPrototypeOf(WrapProvider)).apply(this, arguments));
      }

      _createClass(WrapProvider, [{
        key: 'render',
        value: function render() {
          var _props = this.props,
              _props$initialState = _props.initialState,
              initialState = _props$initialState === undefined ? {} : _props$initialState,
              _props$initialProps = _props.initialProps,
              initialProps = _props$initialProps === undefined ? {} : _props$initialProps,
              store = _props.store;

          var hasStore = store && store.dispatch && store.getState;
          store = hasStore ? store : initStore(createStore, {}, initialState); // client case, no store but has initialState

          // Fix for _document
          var mergedProps = (0, _pickBy2.default)(this.props, function (value, key) {
            return !skipMerge.includes(key);
          });
          Object.assign(mergedProps, initialProps);

          return React.createElement(
            _reactRedux.Provider,
            { store: store },
            React.createElement(WrappedComponent, mergedProps)
          );
        }
      }], [{
        key: 'getInitialProps',
        value: function () {
          var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    ctx.isServer = !!ctx.req;
                    ctx.store = initStore(createStore, ctx.req);

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
                    return _context.abrupt('return', {
                      initialProps: _context.t1,
                      initialState: _context.t2
                    });

                  case 12:
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

      return WrapProvider;
    }(_react.PureComponent);
  };
};

exports.default = wrapProvider;
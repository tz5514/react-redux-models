'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.connect = connect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var connectModel = function connectModel(options) {
  return function (WrappedComponent) {
    var ConnectModel = function (_React$PureComponent) {
      _inherits(ConnectModel, _React$PureComponent);

      function ConnectModel() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ConnectModel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ConnectModel.__proto__ || Object.getPrototypeOf(ConnectModel)).call.apply(_ref, [this].concat(args))), _this), _this.ConnectWrapper = connect(_extends({}, options, {
          store: _this.context.store
        }))(WrappedComponent), _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(ConnectModel, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(this.ConnectWrapper, this.props);
        }
      }]);

      return ConnectModel;
    }(_react2.default.PureComponent);

    ConnectModel.contextTypes = {
      store: _propTypes2.default.object
    };


    (0, _hoistNonReactStatics2.default)(ConnectModel, WrappedComponent);
    return ConnectModel;
  };
};

function connect(_ref2) {
  var store = _ref2.store,
      stateSelector = _ref2.stateSelector,
      actionOptions = _ref2.actions,
      computedValueOptions = _ref2.computedValues,
      _ref2$importDispatch = _ref2.importDispatch,
      importDispatch = _ref2$importDispatch === undefined ? false : _ref2$importDispatch;

  var connectParams = [];

  // actions    
  if ((0, _isPlainObject2.default)(actionOptions) && !(0, _isEmpty2.default)(actionOptions)) {
    // generate mapDispatchToProps function from combinedActions
    connectParams[1] = function (dispatch) {
      var dispatchObject = importDispatch ? { dispatch: dispatch } : {};
      return Object.assign(dispatchObject, { actions: store.getActions(actionOptions) });
    };
  } else {
    connectParams[1] = function (dispatch) {
      return importDispatch ? { dispatch: dispatch } : {};
    };
  }

  // computedValues
  if ((0, _isPlainObject2.default)(computedValueOptions) && !(0, _isEmpty2.default)(computedValueOptions)) {
    connectParams[0] = function (state) {
      var reselectedComputedValues = (0, _mapValues2.default)(store.getComputedValues(computedValueOptions), function (computedValue) {
        return (0, _reselect.createSelector)(computedValue.selectors, computedValue.compute)(state);
      });

      return stateSelector ? Object.assign({}, stateSelector(state), reselectedComputedValues) : reselectedComputedValues;
    };
  } else {
    connectParams[0] = stateSelector;
  }

  return _reactRedux.connect.apply(undefined, connectParams);
}

exports.default = connectModel;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  function Model() {
    _classCallCheck(this, Model);

    this.initialState = {};
    this.actions = {};
    this.reducers = {};
    this.originalActionList = [];
  }

  _createClass(Model, [{
    key: 'bindActions',
    value: function bindActions(dispatch) {
      var actionCreators = this.actions;
      this.originalActionList = Object.keys(actionCreators);
      this.actions = (0, _redux.bindActionCreators)(this.actions, dispatch);
      for (var actionName in this.actions) {
        this.actions[actionName].creator = actionCreators[actionName];
      }
    }
  }, {
    key: 'importActions',
    value: function importActions(getActions) {
      var importOptions = this.constructor.importActions;
      if (importOptions) {
        Object.assign(this.actions, getActions(importOptions));
      }
    }
  }, {
    key: 'getOriginalActions',
    value: function getOriginalActions() {
      var _this = this;

      return (0, _pickBy2.default)(this.actions, function (action, key) {
        return _this.originalActionList.includes(key);
      });
    }
  }]);

  return Model;
}();

Model.importActions = {};
exports.default = Model;
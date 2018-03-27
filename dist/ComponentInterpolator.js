'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require('invariant');
var Component = require('preact').Component;
var h = require('preact').h;
var clone = require('extend').bind(true);
var WRAPPER_PATTERN = /(\*+)/;
var PLACEHOLDER_PATTERN = /(%\{.*?\})/;

// Replace a "$1" text descendant in this tree with the newDescendants
var injectNewDescendants = function injectNewDescendants(element, newDescendants, props, ensureInjected) {
  newDescendants.injectedCount = newDescendants.injectedCount || 0;
  props = props || {};

  var children = element.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    children[i] = child.nodeName ? injectNewDescendants(child, newDescendants) : child;
  }

  var injectIndex = getInjectIndex(children);
  if (injectIndex >= 0) {
    children.splice.apply(children, [injectIndex, 1].concat(newDescendants));
    newDescendants.injectedCount++;
  }

  props.children = children.length ? children : [];
  if (ensureInjected) {
    invariant(newDescendants.injectedCount === 1, 'wrappers must have a single "$1" text descendant');
  }
  return clone(element, props);
};

var getInjectIndex = function getInjectIndex(children, containerName) {
  var child,
      index = -1;
  for (var i = 0; i < children.length; i++) {
    child = children[i];
    if (typeof child !== "string") continue;
    invariant(child === "$1", containerName + ' may not have any non-"$1" text children"');
    invariant(index === -1, containerName + ' may not have multiple "$1" text children"');
    index = i;
  }
  return index;
};

var ComponentInterpolator = function (_Component) {
  _inherits(ComponentInterpolator, _Component);

  function ComponentInterpolator() {
    _classCallCheck(this, ComponentInterpolator);

    return _possibleConstructorReturn(this, (ComponentInterpolator.__proto__ || Object.getPrototypeOf(ComponentInterpolator)).apply(this, arguments));
  }

  _createClass(ComponentInterpolator, [{
    key: 'inferChildren',
    value: function inferChildren() {
      var tokens = (this.props.string || '').split(WRAPPER_PATTERN);
      this.keyCounter = 0;
      var inferredChildren = this.interpolateAllComponents(tokens);

      var currentChildren = this.props.children;

      var index = getInjectIndex(currentChildren, '<ComponentInterpolator>');
      invariant(index >= 0, '<ComponentInterpolator> must have a "$1" text child"');
      currentChildren.splice.apply(currentChildren, [index, 1].concat(inferredChildren));
      return currentChildren;
    }
  }, {
    key: 'interpolateAllComponents',
    value: function interpolateAllComponents(tokens, eof) {
      var token, child;
      var children = [];
      var wrappers = this.props.wrappers || {};
      while (tokens.length) {
        token = tokens.shift();
        if (token === eof) break;
        if (token.match(WRAPPER_PATTERN)) {
          invariant(child = wrappers[token], `<ComponentInterpolator> expected '${token}' wrapper, none found`);
          child = injectNewDescendants(child, this.interpolateAllComponents(tokens, token), { key: this.keyCounter++ }, true);
          children.push(child);
        } else {
          children.push.apply(children, this.interpolatePlaceholders(token));
        }
      }
      return children;
    }
  }, {
    key: 'interpolatePlaceholders',
    value: function interpolatePlaceholders(string) {
      var token, child;
      var tokens = string.split(PLACEHOLDER_PATTERN);
      var children = [];
      while (tokens.length) {
        token = tokens.shift();
        if (token.match(PLACEHOLDER_PATTERN)) {
          token = token.slice(2, -1);
          invariant(this.props.hasOwnProperty(token), `<ComponentInterpolator> expected '${token}' placeholder value, none found`);
          child = this.props[token];
          child = child && child.nodeName ? clone(child, { key: this.keyCounter++ }) : child;
          children.push(child);
        } else {
          children.push(token);
        }
      }
      return children;
    }
  }, {
    key: 'render',
    value: function render() {
      return h('span', {}, this.inferChildren());
    }
  }]);

  return ComponentInterpolator;
}(Component);

module.exports = ComponentInterpolator;
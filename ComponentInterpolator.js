var invariant = require('invariant');
var Component = require('preact').Component;
var h = require('preact').h;
var clone = require('extend').bind(true);
var WRAPPER_PATTERN = /(\*+)/;
var PLACEHOLDER_PATTERN = /(%\{.*?\})/;

// Replace a "$1" text descendant in this tree with the newDescendants
var injectNewDescendants = function(element, newDescendants, props, ensureInjected) {
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

var getInjectIndex = function(children, containerName) {
  var child, index = -1;
  for (var i = 0; i < children.length; i++) {
    child = children[i];
    if (typeof child !== "string") continue;
    invariant(child === "$1", containerName + ' may not have any non-"$1" text children"');
    invariant(index === -1, containerName + ' may not have multiple "$1" text children"');
    index = i;
  }
  return index;
};

class ComponentInterpolator extends Component {
  inferChildren() {
    var tokens = (this.props.string || '').split(WRAPPER_PATTERN);
    this.keyCounter = 0;
    var inferredChildren = this.interpolateAllComponents(tokens);

    var currentChildren = this.props.children;

    var index = getInjectIndex(currentChildren, '<ComponentInterpolator>');
    invariant(index >= 0, '<ComponentInterpolator> must have a "$1" text child"');
    currentChildren.splice.apply(currentChildren, [index, 1].concat(inferredChildren));
    return currentChildren;
  }

  interpolateAllComponents(tokens, eof) {
    var token, child;
    var children = [];
    var wrappers = this.props.wrappers || {};
    while (tokens.length) {
      token = tokens.shift();
      if (token === eof) break;
      if (token.match(WRAPPER_PATTERN)) {
        invariant(
          child = wrappers[token],
          `<ComponentInterpolator> expected '${token}' wrapper, none found`
        );
        child = injectNewDescendants(
          child,
          this.interpolateAllComponents(tokens, token),
          { key: this.keyCounter++ },
          true
        );
        children.push(child);
      }
      else {
        children.push.apply(children, this.interpolatePlaceholders(token));
      }
    }
    return children;
  }

  interpolatePlaceholders(string) {
    var token, child;
    var tokens = string.split(PLACEHOLDER_PATTERN);
    var children = [];
    while (tokens.length) {
      token = tokens.shift();
      if (token.match(PLACEHOLDER_PATTERN)) {
        token = token.slice(2, -1);
        invariant(
          this.props.hasOwnProperty(token),
          `<ComponentInterpolator> expected '${token}' placeholder value, none found`
        );
        child = this.props[token];
        child = child && child.nodeName ? clone(child, {key: this.keyCounter++}) : child;
        children.push(child);
      } else {
        children.push(token);
      }
    }
    return children;
  }

  render() {
    return h('span', {}, this.inferChildren());
  }
}

module.exports = ComponentInterpolator;


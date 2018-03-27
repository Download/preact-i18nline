var log = require('./util/createLogger')('preact-i18nline:webpack-loader');

var I18nline = require("i18nline");
var config = I18nline.config;
var preprocess = require("./preprocess");
var hasTranslatableText = require("./hasTranslatableText")(config);

/*
 * there's code in this file that dynamically requires plugins; it's
 * not needed in the browser, so we skip it ... otherwise webpack
 * will load *all* of i18nline (which includes things like fs, and
 * will fail).
 */
var noParsePath = "i18nline/lib/i18nline";
var addNoParse = function() {
  var escapeRegExp = require("./util/escapeRegExp");
  var path = require("path");
  var mod = this.options.module;

  mod.noParse = mod.noParse || [];
  if (!Array.isArray(mod.noParse))
    mod.noParse = [mod.noParse];
  mod.noParse.push(new RegExp(escapeRegExp(path.normalize(noParsePath))));

  addNoParse = Function.prototype;
};

module.exports = function(source) {
  this.cacheable();
  addNoParse.call(this);
  if (hasTranslatableText(source))
    source = preprocess(source, config);
  return source;
};

log.log('Initialized ' + log.name);


var log = require('./util/createLogger')('preact-i18nline:webpack-loader');

var I18nline = require("i18nline");
var config = I18nline.config;
var preprocess = require("./preprocess");
var hasTranslatableText = require("./hasTranslatableText")(config);

module.exports = function(source) {
  this.cacheable();
  if (hasTranslatableText(source))
    source = preprocess(source, config);
  return source;
};

log.log('Initialized ' + log.name);

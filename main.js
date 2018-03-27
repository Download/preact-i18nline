var log = require('./util/createLogger')('preact-i18nline');
var preprocess = require("./preprocess");

module.exports = function(i18nline) {
  var JsProcessor = i18nline.processors.JsProcessor;
  var config = i18nline.config;
  var origPreProcess = JsProcessor.prototype.preProcess;
  var hasTranslatableText = require("./hasTranslatableText")(config);

  JsProcessor.prototype.preProcess = function(source) {
    var fileData = origPreProcess.call(this, source);

    // avoid a parse if we can
    fileData.skip = fileData.skip && !hasTranslatableText(source);

    if (!fileData.skip) {
      var ast = fileData.ast || this.parse(source);
      preprocess.ast(ast, config);
      fileData.ast = ast;
    }

    return fileData;
  };
};

log.log('Initialized ' + log.name);


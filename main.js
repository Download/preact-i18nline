var log = require('./util/createLogger')('preact-i18nline');
var preprocess = require("./preprocess");
var NewIndex = require("./newindex");
var createHasTranslatableText = require("./hasTranslatableText");

module.exports = function(i18nline) {
  var proto = i18nline.processors.JsProcessor.prototype;
  var hasTranslatableText = createHasTranslatableText(i18nline.config);

  function preProcess(source) {
    var fileData = proto.oldPreProcess.call(this, source);
    // avoid a parse if we can
    fileData.skip = fileData.skip && !hasTranslatableText(source);
    if (!fileData.skip) {
      var ast = fileData.ast || this.parse(source);
      preprocess.ast(ast, i18nline.config);
      fileData.ast = ast;
    }
    return fileData;
  }

  if (proto.preProcess !== preProcess) {
    proto.oldPreProcess = proto.preProcess;
    proto.preProcess = preProcess;
  }

  if (i18nline.Commands.Index !== NewIndex) {
    i18nline.Commands.Index = NewIndex;
  }
};

log.log('Initialized ' + log.name);

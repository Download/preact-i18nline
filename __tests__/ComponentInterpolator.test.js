var log = require('../util/createLogger')('preact-i18nline:test:ComponentInterpolator');

var expect = require('chai').expect;
var subjector = require('../test_utils/subjector');
var Subject = subjector(__dirname + '/../ComponentInterpolator');

var render = require('preact-render-to-string');
var h = require('preact').h; // eslint-disable-line no-unused-vars

var removeNoise = function(string) {
  return string.replace(/^<span>/, '')
               .replace(/<\/span>/, '');
};

describe('ComponentInterpolator', function() {

  it('renders', function() {
    var subject = Subject({
      string: 'Hello World',
      wrappers: {}
    }, ["$1"]);
    log.debug(log.name + ': subject=', subject);
    var rendered = removeNoise(render(subject));
    log.log(log.name + ': rendered=', rendered);
    expect(rendered).to.equal('Hello World');
  });

  it('escapes html in the string', function() {
    var subject = Subject({
      string: 'My favorite tag is <script />',
      wrappers: {}
    }, ["$1"]);
    log.debug(log.name + ': subject=', subject);
    var rendered = removeNoise(render(subject));
    log.log(log.name + ': rendered=', rendered);
    expect(rendered).to.equal('My favorite tag is &lt;script /&gt;');
  });

  it('interpolates wrapper components', function() {
    var subject = Subject({
      string: 'Hi, Jane, click *here* right ***now **please** ***',
      wrappers: {
        '*': <a href='/'><img />$1</a>,
        '**': <i>$1</i>,
        '***': <b><em>$1</em></b>
      }
    }, [<hr />, "$1"]);
    log.debug(log.name + ': subject=', subject);
    var rendered = removeNoise(render(subject));
    log.log(log.name + ': rendered=', rendered);
    expect(rendered).to.equal(
      '<hr />Hi, Jane, click <a href="/"><img />here</a> right <b><em>now <i>please</i> </em></b>'
    );
  });

  it('interpolates placeholder components', function() {
    var subject = Subject({
      string: 'Hi %{user} (%{user_id}), create %{count} new accounts',
      wrappers: {},
      user: "Jane",
      user_id: 0,
      count: <input />
    }, ["$1"]);
    log.debug(log.name + ': subject=', subject);
    var rendered = removeNoise(render(subject));
    log.log(log.name + ': rendered=', rendered);
    expect(rendered).to.equal(
      'Hi Jane (0), create <input /> new accounts'
    );
  });
});

log.log('Initialized ' + log.name);

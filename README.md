# preact-i18nline
#### Keep your translations in line - with Preact!

[![Greenkeeper badge](https://badges.greenkeeper.io/Download/preact-i18nline.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/preact-i18nline.svg)](https://npmjs.com/package/preact-i18nline)
[![license](https://img.shields.io/npm/l/preact-i18nline.svg)](https://github.com/download/preact-i18nline/LICENSE)
[![travis](https://img.shields.io/travis/Download/preact-i18nline.svg)](https://travis-ci.org/Download/preact-i18nline)
[![greenkeeper](https://img.shields.io/david/Download/preact-i18nline.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

```
  ██████╗ ██████╗ ███████╗ █████╗  ██████╗████████╗     ██╗   ███╗   ██╗██╗     ██╗███╗   ██╗███████╗
  ██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝     ██║   ████╗  ██║██║     ██║████╗  ██║██╔════╝
  ██████╔╝██████╔╝█████╗  ███████║██║        ██║ █████╗ ██║18 ██╔██╗ ██║██║     ██║██╔██╗ ██║█████╗
  ██╔═══╝ ██╔══██╗██╔══╝  ██╔══██║██║        ██║ ╚════╝ ██║   ██║╚██╗██║██║     ██║██║╚██╗██║██╔══╝
  ██║     ██║  ██║███████╗██║  ██║╚██████╗   ██║        ██║   ██║ ╚████║███████╗██║██║ ╚████║███████╗
  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝        ╚═╝   ╚═╝  ╚═══╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

                        keep your translations in line  -  with preact!
```

preact-i18nline brings [I18nline](https://github.com/download/i18nline)
to [Preact](https://preactjs.com/) via the html [`translate`](http://www.w3.org/International/questions/qa-translate-flag) attribute. 
I18n doesn't get any easier than this.

## TL;DR

preact-i18nline lets you do this:

```html
<p translate="yes">
  Hey {this.props.user.name}!
  Although I am <Link to="route">linking to something</Link> and
  have some <strong>bold text</strong>, the translators will see
  <strong><em>absolutely no markup</em></strong> and will only have a
  single string to translate :o
</p>
```

Write your components as you normally would, and just put a
`translate="yes"` attribute on any element/component that needs to be
localized. Seriously.

And because the default translation is inline, it will be used as a
fallback if a translation is missing or hasn't happened yet.

Best of all, you don't need to maintain separate translation files
anymore; I18nline will do it for you.

## What is this?
This project is a port of [react-i18nliner](https://github.com/jenseng/react-i18nliner) by
[Jon Jensen](https://github.com/jenseng) to [Preact](https://preactjs.com), a 3kB alternative
to React.

## How does it work?

preact-i18nline [preprocesses](https://github.com/download/preact-i18nline/blob/master/preprocess.js)
your JSX, transforming it into something truly localizable. It infers
[placeholders for expressions](https://github.com/download/preact-i18nline/blob/57f813bc3ef6769be7aab47eb42fd4d081e1a498/__tests__/preprocess.test.js#L21)
and [wrappers for elements/components](https://github.com/download/preact-i18nline/blob/57f813bc3ef6769be7aab47eb42fd4d081e1a498/__tests__/preprocess.test.js#L17),
and separates the localizable string. [At runtime](https://github.com/download/preact-i18nline/blob/master/ComponentInterpolator.js),
it localizes the string, interpolating the [wrappers](https://github.com/download/preact-i18nline/blob/57f813bc3ef6769be7aab47eb42fd4d081e1a498/__tests__/ComponentInterpolator.test.js#L28)
and [placeholders](https://github.com/download/preact-i18nline/blob/57f813bc3ef6769be7aab47eb42fd4d081e1a498/__tests__/ComponentInterpolator.test.js#L42) into the correct locations.

Localizable strings are detected both from the text nodes, as well as from [translatable attributes](http://www.w3.org/TR/html5/dom.html#the-translate-attribute) within the `translate="yes"` element.

preact-i18nline enhances I18nline, so that it can extract any of these
`translate="yes"` strings from your codebase (in addition to regular
`I18n.t` calls). Once you get everything translated, just stick it on
`I18n.translations` and everything will Just Work™.

## Examples

### Placeholders

A placeholder will be created for the input:

```html
<label translate="yes">
  Create <input /> new accounts
</label>
```

As well as for arbitrary JSX expressions:

```html
<div translate="yes">
  Welcome back, {user.name}.
</div>
```

By default, placeholder keys will be inferred from the content, so a
translator would see `"Create %{input} keys"` and `"Welcome back,
%{user_name}"`. For complicated expressions, these placeholder keys can
get a bit long/gnarly. Having to retranslate strings that "changed" just
because you refactored some code is terrible, so you can use keys to
be a bit more explicit:

```html
<label translate="yes">
  Create <input key="numAccounts" onChange={this.addAccounts} /> new
  accounts
</label>
```

In this case the extracted string would just be `"Create %{num_accounts}
new accounts"`

### Wrappers

Translators won't see any components or markup; they will be replaced with
a simple wrapper notation. In this example, the extracted string would be
`"That is *not* the right answer"`:

```html
<div translate="yes">
  That is <b>not</b> the right answer
</div>
```

### Attributes

In addition to the `"Edit your settings *here*"` string, the
`"Your Account"` will also be preprocessed, since it is a valid
[translatable attribute](http://www.w3.org/TR/html5/dom.html#the-translate-attribute)
within a translated element.

```html
<div translate="yes">
  Edit your settings <a href="/foo" title="Your Account">here</a>
</div>
```

## Installation

```sh
npm install -S i18nline preact-i18nline
```

## Configuration

In your `package.json`, create an object named `"i18n"` and 
specify your project's global configuration settings there. Or, 
if you prefer, you can create a `.i18nrc` options file in the root
of your project.

The typical configuration you'd want for a preact project would 
look something like this:

```json
{
  "plugins": [
    "preact-i18nline"
  ],
  "outputFile": "my/translations/en.json"
}
```

Important here is that you register `preact-i18nline` as a plugin.
This will ensure that when you export strings for translation, all of your
new `translate="yes"` stuff will get picked up.

Refer to the [i18nline config docs](https://github.com/download/i18nline#configuration)
for details on the configuration options.


## Usage 
Preprocess all your js and jsx files with preact-i18nline

How you hook up the preprocessor will depend on how you bundle your assets:

#### webpack

Add [this loader](https://github.com/download/preact-i18nline/blob/master/webpack-loader.js)
to your config, e.g.

```js
{
  module: {
    loaders: [
      { test: /\.js$/, loader: "preact-i18nline/webpack-loader" }
      ...
    ],
  },
  ...
}
```

**TODO: example not ported over yet**
Check out [this example app](https://github.com/download/preact-i18nline/tree/master/examples/webpack)
to see how everything is wired together.

#### browserify

Use [this transform](https://github.com/download/preact-i18nline/blob/master/browserify-transform.js),
e.g.

```bash
$ browserify -t preact-i18nline/browserify-transform app.js > bundle.js
```

#### something else?

It's not too hard to roll your own; as you can see in the loader and
transform above, the heavy lifting is done by `preprocess`. So whether
you use ember-cli, sprockets, grunt concat, etc., it's relatively
painless to add a little glue code that runs preprocess on each
source file.

## Add the preact-i18nline runtime extensions to i18n

Both i18nline and preact-i18nline add some extensions to i18n.js to 
help with the runtime processing of the translations. You can require
I18n via preact-i18nline to get a `I18n` object that has all extensions
applied already:

```js
var I18n = require("preact-i18nline/i18n");
```

Alternatively, you can apply the extensions manually:

```js
var I18n = // get it from somewhere, script tag, whatever
require('i18nline/lib/extensions/i18n_js')(I18n);
require('preact-i18nline/dist/extensions/i18n_js')(I18n);
```

## Working with translations

Since preact-i18nline is just an i18nline plugin, you can use the i18nline 
CLI to extract translations from your codebase; it will pick up normal 
`I18n.t` usage, as well as your new `translate="yes"` components. The 
easiest way to do this is to add a `"scripts"` section to your package.json
and call i18nline from there:

*package.json*
```json
{
  "i18n": {
    "plugins": {
      "preact-i18nline"
    }
  },
  "scripts": {
    "translations": "i18nline export"
  }
}
```

Then you can simply invoke it via NPM as usual:

```sh
$ npm run translations
```

Once you've gotten all your translations back from the translators,
simply stick them on `I18n.translations`; it expects the translations 
to be of the format:

```js
I18n.translations = {
  "en": {
    "some_key": "Hello World",
    "another_key": "What's up?"
  },
  "es": {
    "some_key": "Hola mundo",
    "another_key": "¿Qué tal?"
  },
  ...
}
```

## Configuration

In addition to the 
[i18nline configuration](https://github.com/download/i18nline#configuration),
preact-i18nline adds some options specific to JSX processing:

### autoTranslateTags
An array of strings, or a string with (a comma separated list of) 
tag names that should be translated automatically. Defaults to `[]`.

#### example
*package.json*
```json
{
  "i18n": {
    "autoTranslateTags": ["h1", "h2", "h3", "h4", "h5", "h6", "p"]
  }
}
```

These tags will have an implicit `translate="yes"`, keeping your markup
simple.

Note that this works for both regular HTML elements, as well as for your
own custom components. For example, if you decided you wanted to use a
`<T>` component everywhere instead of `translate="yes"`, you could add it
to autoTranslateTags, and its runtime implementation could be as simple
as:

```js
class T extends Component {
  render() {
    return <span {...this.props} />;
  }
}
```

### neverTranslateTags
An array of strings, or a string with (a comma separated list of) 
tag names that should **not** be translated automatically. 
Defaults to `[]`.

Similarly to `autoTranslateTags`, if you have certain tags you 
**don't** want to translate automatically, (e.g. `<code>`), 
you can specify those in a similar manner.

#### example
*package.json*
```json
{
  "i18n": {
    "neverTranslateTags": ["code"],
  }
}
```

If those are ever nested in a larger translatable element, they
will be assumed to be untranslatable, and a placeholder will be created
for them. 


## Gotchas

### What about pluralization? Or gender?

i18nline does support basic pluralization (via i18n-js), but you need
to use pure js for that, e.g.

```html
<div>
  {I18n.t({one: "You have 1 item", other: "You have %{count} items"}, {count: theCount})}
</div>
```

### Every JSX expression makes a placeholder

This kind of gets to a general rule of i18n: don't concatenate strings. 
For example,

```js
return (
  <b translate="yes">
    You are {this.props.isAuthorized ? "authorized" : "NOT authorized"}
  </b>
);
```

The extracted string will be `"You are %{opaque_placeholder}"` and the
translators won't get a chance to translate the two inner strings (much
less without context). So don't do that; whenever you have logically
different sentences/phrases, internationalize them separately, e.g.

```js
return (this.props.isAuthorized ?
         <b translate="yes">You are authorized</b> :
         <b translate="yes">You are NOT authorized</b>);
```

**NOTE:** A subsequent release of preact-i18nline may add a check for
this situation that will cause an `i18nline:check` failure. 
You've been warned :)

### Cloning this project under Windows

This project's eslint settings force a check on the use of linefeed characters
that will fail when the project is cloned with the git
[core.autocrlf](https://git-scm.com/book/tr/v2/Customizing-Git-Git-Configuration)
setting set to `true`, which is the default on Windows. So make sure to change
that setting beforehand. The easiest way to do this is probably to `git init` a new
repo for this project and change the setting, and only then add this repo as a
remote and pull from it.

## Related Projects

* [i18nline](https://github.com/download/i18nline)
* [react-i18nliner](https://github.com/jenseng/react-i18nliner)
* [i18nliner (ruby)](https://github.com/jenseng/i18nliner)
* [i18nliner-js](https://github.com/jenseng/i18nliner-js)
* [i18nliner-handlebars](https://github.com/fivetanley/i18nliner-handlebars)

## License

Copyright (c) 2016 by Stijn de Witt and Jon Jensen, released under the MIT license

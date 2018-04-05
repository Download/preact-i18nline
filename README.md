# preact-i18nline
#### Keep your translations in line - with Preact!

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

## Project setup
To setup a project with `preact-i18nline`, we mostly follow the `i18nline` 
project setup, with some small changes. The overview of the setup is repeated 
below, but for most steps please refer to the [i18nline project setup docs](https://github.com/Download/i18nline/tree/v2#project-setup).

* Install `i18nline` and `preact-i18nline` (see next section)
* Create a `script` in *package.json* to run the command-line tool (see i18nline docs)
* Add the `preact-i18nline/webpack-loader` to your Webpack configuration
* Import `I18n` and use `translate="yes"` to render internationalized text.
* Create an empty file in the `out` folder (by default: `'src/i18n'`) named 
  `'[locale].json'` for each locale you want to support.  (see i18nline docs)
* Run `i18nline synch` to synch the translation files and index file.  (see i18nline docs)
* `import` the index file into your project.  (see i18nline docs)
* Call `I18n.changeLocale` to set the locale (which loads the right 
  translation file on demand, see i18nline docs)
* Call `I18n.on` to react to the `'change'` event (e.g. by re-rendering) (see i18nline docs)
* Get your translators to translate all the messages :)

## Installation

```sh
npm install -S i18nline preact-i18nline
```

## Add the Webpack loader
Add [this loader](https://github.com/download/preact-i18nline/blob/master/webpack-loader.js)
to your config, e.g.

*webpack.config.js*
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

### For Preact CLI 
If your app is generated with Preact CLI, Webpack is configured and managed 
for you. So instead of configuring Webpack directly, we configure Preact CLI:

*preact.config.js*
```js
export default (config, env, helpers) => {
	// Use Preact CLI's helpers object to get the babel-loader
	let babel = helpers.getLoadersByName(config, 'babel-loader')[0].rule;
	// Update the loader config to include preact-i18nline
	babel.loader = [
		{ // create an entry for the old loader
			loader: babel.loader,
			options: babel.options
		},
		{ // add the preact-i18nline webpack loader
			loader: 'preact-i18nline/webpack-loader'
		}
	];
	// remove the old loader options
	delete babel.options;
};
```

## Usage
In the Javascript files you want to translate, import I18n:

```js
import I18n from 'i18nline';
```

Then, write your JSX and add `translate="yes"` to any elements
you want to translate:

*src/app/Greeting.jsx*
```js
import { h } from 'preact';
import I18n from 'i18nline';

const User = props => (
  <b>{props.name}</b>
)

const Greeting = props => (
	<p class="greeting" translate="yes">
    Hello, <User name="Bob" />!
  </p>
);

export default Greeting;
```

Now you are ready to generate the translation files. Run the
`i18nline synch` command via the script you setup in *package.json*:

```sh
$ npm run i18n
```

This will generate 3 files for you (in `src/18n` by default):

* `default.json`: the default translations extracted from the source
* `en.json`: the translation file for the default locale (`'en'` by default)
* `index.js`: the index file to import into your project

To add additional languages, just add empty files named `[locale].json` 
(e.g. `'fr.json'`, `'de.json'`, etc) in the same folder and run 
`i18nline synch` again. `i18nline` will populate the empty files with
the default translations.

To learn how to change locales and listen to locale change events, 
refer to the [i18nline documentation](https://github.com/Download/i18nline/tree/v2#call-i18nchangelocale-to-change-the-locale).


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

## Configuration

From version 2 onwards, `i18nline` and `preact-i18nline` should be 
effectively zero configuration for most projects. Stuff should Just Work.

If you find you need to change the configuration, you can configure 
i18nline through *package.json*, *i18nline.rc* or command line arguments.

If multiple sources of configuration are present, they will be 
applied in this order, with the last option specified overwriting
the previous settings:

* Defaults
* package.json
* .i18nrc file
* CLI arguments

Refer to the [i18nline configuration docs](https://github.com/Download/i18nline/tree/v2#configuration) for details.

### Auto-config of plugins
Since version 2, `i18nline` supports auto-config of plugins by looking 
at the dependencies for your project. So it will automatically detect 
`preact-i18nline` for you. You don't have to do anything for it. But 
just for completeness, here is how you would configure the 
`preact-18nline` plugin if you wanted to do it explicitly:

*package.json*
```json
{
  "i18n": {
    "plugins": [
      "preact-i18nline"
    ]
  }
}
```

## Extra configuration options
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
const T = (props) => (
  <span {...this.props} />
)
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


## Tool support
`preact-i18nline` mainly focuses on Webpack for it's tool support. There is some
support for Browserify (untested) or you can roll your own integration.

### browserify

There is some support for Browserify through [this transform](https://github.com/download/preact-i18nline/blob/master/browserify-transform.js),
e.g.

```bash
$ browserify -t preact-i18nline/browserify-transform app.js > bundle.js
```

However, to be honest it was inherited from `react-i18nliner` and I'm not using
it myself and haven't tested it in ages so your mileage may vary. If you do use
it, please report any issues you may find (and be prepared to make a PR for it).

### Roll your own

It's not too hard to roll your own tool support; as you can see in the 
loader and transform above, the heavy lifting is done by `preprocess`. 
So whether you use ember-cli, sprockets, grunt concat, etc., it's 
relatively painless to add a little glue code that runs preprocess 
on each source file.

## Add the preact-i18nline runtime extensions to i18n

Both i18nline and preact-i18nline add some extensions to i18n.js to 
help with the runtime processing of the translations. 

When you follow the recommended project setup you should not have to worry
about this. `i18nline` will automatically detect `preact-i18nline` and 
modify the generated index file to import `I18n` from `preact-inline/i18n` 
instead of from `i18nline`. That will automatically take care of things.
However if you want more control or are not using the generated index file,
you can require I18n via preact-i18nline to get a `I18n` object that has all 
extensions applied already:

```js
var I18n = require("preact-i18nline/i18n");
```

You only need to do this in one place (e.g. in your app's main file), because 
the returned instance is actually the same object as is returned by `i18nline`.
`preact-i18nline` just adds its extensions to it.

Alternatively, you can apply the extensions manually:

```js
var I18n = // get it from somewhere, script tag, whatever
// if you did not get it from `i18nline`, you need to apply 
// the i18nline extensions manually as well
require('i18nline/lib/extensions/i18n_js')(I18n);
// finally apply the preact-i18nline extensions
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
  "scripts": {
    "i18n": "i18nline synch"
  }
}
```

Then you can simply invoke it via NPM as usual:

```sh
$ npm run i18n
```

Refer to the [i18nline project setup docs](https://github.com/Download/i18nline/tree/v2#create-a-script-to-run-the-command-line-tool) 
for more information.

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

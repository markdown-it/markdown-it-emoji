# markdown-it-emoji

[![Build Status](https://img.shields.io/travis/markdown-it/markdown-it-emoji/master.svg?style=flat)](https://travis-ci.org/markdown-it/markdown-it-emoji)
[![NPM version](https://img.shields.io/npm/v/markdown-it-emoji.svg?style=flat)](https://www.npmjs.org/package/markdown-it-emoji)
[![Coverage Status](https://coveralls.io/repos/markdown-it/markdown-it-emoji/badge.svg?branch=master&service=github)](https://coveralls.io/github/markdown-it/markdown-it-emoji?branch=master)

> Plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser, adding emoji & emoticon syntax support.

__v1.+ requires `markdown-it` v4.+, see changelog.__

Two versions:

- __Full__ (default), with all github supported emojies.
- [Light](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/light.json), with only well supported unicode emojies and reduced size.

Also supports emoticons [shortcuts](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/shortcuts.js) like `:)`, `:-(`, and other. See the full list in link above.


## Install

node.js, browser:

```bash
npm install markdown-it-emoji --save
bower install markdown-it-emoji --save
```

## Use

### init

```js
var md = require('markdown-it')();
var emoji = require('markdown-it-emoji');
// Or for light version
// var emoji = require('markdown-it-emoji/light');

md.use(emoji [, options]);
```

Options are not mantatory:

- __defs__ (Object) - rewrite available emojies definitions
  - example: `{ name1: char1, name2: char2, ... }`
- __enabled__ (Array) - disable all emojies except whitelisted
- __shortcuts__ (Object) - rewrite default shortcuts
  - example: `{ "smile": [ ":)", ":-)" ], "laughing": ":D" }`

_Differences in browser._ If you load script directly into the page, without
package system, module will add itself globally with name `markdownitEmoji`.
Then init will look a bit different:

```js
var md = window.markdownit().use(window.markdownitEmoji);
```


### change output

By default, emojies are rendered as appropriate unicode chars. But you can change
renderer function as you wish.

Render as span blocks (for example, to use custom iconic font):

```js
// ...
// initialize

md.renderer.rules.emoji = function(token, idx) {
  return '<span class="emoji emoji_' + token[idx].markup + '"></span>';
};
```

Or use [twemoji](https://github.com/twitter/twemoji):

```js
// ...
// initialize

var twemoji = require('twemoji')

md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content);
};
```

__NB 1__. Read [twemoji docs](https://github.com/twitter/twemoji#string-parsing)!
May be you need more options to change image size & type.

__NB 2__. For twemoji you can like to fit image height to line height with this
style:

```css
.emoji {
  height: 1.2em;
}
```

## License

[MIT](https://github.com/markdown-it/markdown-it-emoji/blob/master/LICENSE)

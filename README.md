# markdown-it-emoji

[![CI](https://github.com/markdown-it/markdown-it-emoji/actions/workflows/ci.yml/badge.svg)](https://github.com/markdown-it/markdown-it-emoji/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/markdown-it-emoji.svg?style=flat)](https://www.npmjs.org/package/markdown-it-emoji)
[![Coverage Status](https://coveralls.io/repos/markdown-it/markdown-it-emoji/badge.svg?branch=master&service=github)](https://coveralls.io/github/markdown-it/markdown-it-emoji?branch=master)

> Plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser, adding emoji & emoticon syntax support. Also supports emoticons [shortcuts](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/shortcuts.js) like `:)`, `:-(`, and others.

__NOTE. v3 changed exports, see below.__


## Install

```bash
npm install i markdown-it-emoji
```

## Use

### init

```js
//
// { full, light, bare } configs available.
//
//  full:  includes all available emojis support
//  light: includes small subset of most useable emojis
//  bare:  no defaults
//
// Also CJS & UMD builds available in `dist/` folder of published package,
// if your env not supports ESM modules use.
//
import { full as emoji } from 'markdown-it-emoji'
import markdownit from 'markdown-it'

const md = markdownit().use(emoji/* , options */);
```

Options are not mandatory:

- __defs__ (Object) - rewrite available emoji definitions
  - example: `{ name1: char1, name2: char2, ... }`
- __enabled__ (Array) - disable all emojis except whitelisted
- __shortcuts__ (Object) - rewrite default shortcuts
  - example: `{ "smile": [ ":)", ":-)" ], "laughing": ":D" }`

_Differences in browser._ If you load the script directly into the page without
using a package system, the module will add itself globally with the name `markdownitEmoji`.

### change output

By default, emojis are rendered as appropriate unicode chars. But you can change
the renderer function as you wish.

Render as span blocks (for example, to use a custom iconic font):

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

import twemoji from 'twemoji'

md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content);
};
```

__NB 1__. Read [twemoji docs](https://github.com/twitter/twemoji#string-parsing)!
In case you need more options to change image size & type.

__NB 2__. When using twemoji you can make image height match the line height with this
style:

```css
.emoji {
  height: 1.2em;
}
```

### In your markdown file

```md
Hello from mars :satellite:
```

becomes

```
Hello from mars 📡
```

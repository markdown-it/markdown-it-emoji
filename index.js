'use strict';


var emojies_defs      = require('./lib/data/full.json');
var emojies_shortcuts = require('./lib/data/shortcuts');
var emoji_html        = require('./lib/render');
var emoji_replace     = require('./lib/replace');
var normalize_opts    = require('./lib/normalize_opts');
var twemoji           = null;


module.exports = function emoji_plugin(md, options) {
  var defaults = {
    defs: emojies_defs,
    shortcuts: emojies_shortcuts,
    enabled: []
  };

  var opts = normalize_opts(md.utils.assign({}, defaults, options || {}));

  if (options.renderer === 'unicode' || options.renderer === undefined || options.renderer === null) {
    md.renderer.rules.emoji = (token, idx) => {
      return tokens[idx].content;
    };
  } else if (options.renderer === 'twemoji') {
    if (twemoji === null) {
      twemoji = require('twemoji');
    }
    md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content)
    };
  } else if (options.renderer === 'span') {
    if (options.span_class_prefix === undefined || options.span_class_prefix === null) {
      options.span_class_prefix = "emoji emoji_";
    }
    md.renderer.rules.emoji = (token, idx) => {
      return '<span class="' + options.span_class_prefix + token[idx].markup + '"></span>';
    };
  } else {
    md.renderer.rules.emoji = (token, idx) => {
      return "<!-- Unknown renderer option -->";
    };
  }

  md.core.ruler.push('emoji', emoji_replace(md, opts.defs, opts.shortcuts, opts.scanRE, opts.replaceRE));
};

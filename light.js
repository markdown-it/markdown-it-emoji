'use strict';


var emojies_light     = require('./lib/data/light.json');
var emojies_shortcuts = require('./lib/data/shortcuts');
var emoji_html        = require('./lib/render');
var emoji_replace     = require('./lib/replace');
var normalize_opts    = require('./lib/normalize_opts');


module.exports = function emoji_plugin(md, options) {
  var conf = options || {};

  var opts = normalize_opts({
    emojies: conf.defs || emojies_light,
    shortcuts: conf.shortcuts || emojies_shortcuts,
    enabled: conf.enabled || []
  });

  md.renderer.rules.emoji = emoji_html;

  md.core.ruler.push('emoji', emoji_replace(md, opts.emojies, opts.shortcuts, opts.scanRE));
};

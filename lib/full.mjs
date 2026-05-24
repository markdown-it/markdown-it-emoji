import emojies_defs from './data/full.mjs'
import emojies_shortcuts from './data/shortcuts.mjs'
import bare_emoji_plugin from './bare.mjs'

export default function emoji_plugin (md, options) {
  const defaults = {
    defs: emojies_defs,
    shortcuts: emojies_shortcuts,
    enabled: [],
    mergeDefs: true,
    mergeShortcuts: true
  }

  const opts = md.utils.assign({}, defaults, options || {})

  if (opts.mergeDefs && options && options.defs) {
      opts.defs = md.utils.assign({}, defaults.defs, options.defs)
  }

  if (opts.mergeShortcuts && options && options.shortcuts) {
      opts.shortcuts = md.utils.assign({}, defaults.shortcuts, options.shortcuts)
  }

  bare_emoji_plugin(md, opts)
};

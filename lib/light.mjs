import emojies_defs from './data/light.mjs'
import emojies_shortcuts from './data/shortcuts.mjs'
import bare_emoji_plugin from './bare.mjs'

export default function emoji_plugin (md, options) {
  const defaults = {
    defs: emojies_defs,
    shortcuts: emojies_shortcuts,
    enabled: []
  }

  const opts = md.utils.assign({}, defaults, options || {})

  bare_emoji_plugin(md, opts)
};

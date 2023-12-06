import emoji_html from './render.mjs'
import emoji_replace from './replace.mjs'
import normalize_opts from './normalize_opts.mjs'

export default function emoji_plugin (md, options) {
  const defaults = {
    defs: {},
    shortcuts: {},
    enabled: []
  }

  const opts = normalize_opts(md.utils.assign({}, defaults, options || {}))

  md.renderer.rules.emoji = emoji_html

  md.core.ruler.after(
    'linkify',
    'emoji',
    emoji_replace(md, opts.defs, opts.shortcuts, opts.scanRE, opts.replaceRE)
  )
};

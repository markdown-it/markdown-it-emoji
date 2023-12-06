// Emojies & shortcuts replacement logic.
//
// Note: In theory, it could be faster to parse :smile: in inline chain and
// leave only shortcuts here. But, who care...
//
export default function create_rule (md, emojies, shortcuts, scanRE, replaceRE) {
  const arrayReplaceAt = md.utils.arrayReplaceAt
  const ucm = md.utils.lib.ucmicro
  const has = md.utils.has
  const ZPCc = new RegExp([ucm.Z.source, ucm.P.source, ucm.Cc.source].join('|'))

  function splitTextToken (text, level, Token) {
    let last_pos = 0
    const nodes = []

    text.replace(replaceRE, function (match, offset, src) {
      let emoji_name
      // Validate emoji name
      if (has(shortcuts, match)) {
        // replace shortcut with full name
        emoji_name = shortcuts[match]

        // Don't allow letters before any shortcut (as in no ":/" in http://)
        if (offset > 0 && !ZPCc.test(src[offset - 1])) return

        // Don't allow letters after any shortcut
        if (offset + match.length < src.length && !ZPCc.test(src[offset + match.length])) {
          return
        }
      } else {
        emoji_name = match.slice(1, -1)
      }

      // Add new tokens to pending list
      if (offset > last_pos) {
        const token = new Token('text', '', 0)
        token.content = text.slice(last_pos, offset)
        nodes.push(token)
      }

      const token = new Token('emoji', '', 0)
      token.markup = emoji_name
      token.content = emojies[emoji_name]
      nodes.push(token)

      last_pos = offset + match.length
    })

    if (last_pos < text.length) {
      const token = new Token('text', '', 0)
      token.content = text.slice(last_pos)
      nodes.push(token)
    }

    return nodes
  }

  return function emoji_replace (state) {
    let token
    const blockTokens = state.tokens
    let autolinkLevel = 0

    for (let j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== 'inline') { continue }
      let tokens = blockTokens[j].children

      // We scan from the end, to keep position when new tags added.
      // Use reversed logic in links start/end match
      for (let i = tokens.length - 1; i >= 0; i--) {
        token = tokens[i]

        if (token.type === 'link_open' || token.type === 'link_close') {
          if (token.info === 'auto') { autolinkLevel -= token.nesting }
        }

        if (token.type === 'text' && autolinkLevel === 0 && scanRE.test(token.content)) {
          // replace current node
          blockTokens[j].children = tokens = arrayReplaceAt(
            tokens, i, splitTextToken(token.content, token.level, state.Token)
          )
        }
      }
    }
  }
};

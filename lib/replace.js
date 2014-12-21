'use strict';

/*eslint-disable no-loop-func*/

function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}

module.exports = function emoji_replace(state, emojies, shortcuts, compiledRE) {
  var i, j, l, tokens, token, text, nodes, level, last_pos, emoji_name,
      blockTokens = state.tokens;

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') { continue; }
    tokens = blockTokens[j].children;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];

      if (token.type === 'text' && compiledRE.test(token.content)) {
        text      = token.content;
        last_pos  = 0;
        nodes     = [];
        level     = token.level;
        compiledRE.lastIndex = 0;

        token.content.replace(compiledRE, function(match, offset) {
          // Validate emoji name
          if (shortcuts.hasOwnProperty(match)) {
            // replace shortcut with full name
            emoji_name = shortcuts[match];
          } else {
            emoji_name = match.slice(1, -1);
          }

          // Add new tokens to pending list
          if (offset > last_pos) {
            nodes.push({
              type: 'text',
              content: text.slice(last_pos, offset),
              level: level
            });
          }
          nodes.push({
            type: 'emoji',
            name:  emoji_name,
            to: emojies[emoji_name],
            level: level
          });
          last_pos = offset + match.length;

        });

        if (last_pos < text.length) {
          nodes.push({
            type: 'text',
            content: text.slice(last_pos),
            level: level
          });
        }
        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};

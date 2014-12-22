// Emojies & shortcuts replacement logic.
//
// Note: In theory, it could be faster to parse :smile: in inline chain and
// leave only shortcuts here. But, who care...
//

'use strict';


function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}

module.exports = function create_rule(emojies, shortcuts, compiledRE) {

  function splitTextToken(text, level) {
    var last_pos = 0, nodes = [];

    text.replace(compiledRE, function(match, offset) {
      var emoji_name;
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

    return nodes;
  }

  return function emoji_replace(state) {
    var i, j, l, tokens, token,
        blockTokens = state.tokens;

    for (j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== 'inline') { continue; }
      tokens = blockTokens[j].children;

      // We scan from the end, to keep position when new tags added.
      // Use reversed logic in links start/end match
      for (i = tokens.length - 1; i >= 0; i--) {
        token = tokens[i];

        if (token.type === 'text' && compiledRE.test(token.content)) {
          // replace current node
          blockTokens[j].children = tokens = arrayReplaceAt(
            tokens, i, splitTextToken(token.content, token.level)
          );
        }
      }
    }
  };
};

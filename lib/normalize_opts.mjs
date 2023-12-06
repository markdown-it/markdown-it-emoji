// Convert input options to more useable format
// and compile search regexp

function quoteRE (str) {
  return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

export default function normalize_opts (options) {
  let emojies = options.defs

  // Filter emojies by whitelist, if needed
  if (options.enabled.length) {
    emojies = Object.keys(emojies).reduce((acc, key) => {
      if (options.enabled.indexOf(key) >= 0) acc[key] = emojies[key]
      return acc
    }, {})
  }

  // Flatten shortcuts to simple object: { alias: emoji_name }
  const shortcuts = Object.keys(options.shortcuts).reduce((acc, key) => {
    // Skip aliases for filtered emojies, to reduce regexp
    if (!emojies[key]) return acc

    if (Array.isArray(options.shortcuts[key])) {
      options.shortcuts[key].forEach(alias => { acc[alias] = key })
      return acc
    }

    acc[options.shortcuts[key]] = key
    return acc
  }, {})

  const keys = Object.keys(emojies)
  let names

  // If no definitions are given, return empty regex to avoid replacements with 'undefined'.
  if (keys.length === 0) {
    names = '^$'
  } else {
    // Compile regexp
    names = keys
      .map(name => { return `:${name}:` })
      .concat(Object.keys(shortcuts))
      .sort()
      .reverse()
      .map(name => { return quoteRE(name) })
      .join('|')
  }
  const scanRE = RegExp(names)
  const replaceRE = RegExp(names, 'g')

  return {
    defs: emojies,
    shortcuts,
    scanRE,
    replaceRE
  }
};

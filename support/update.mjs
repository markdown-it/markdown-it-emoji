#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'

const emojiSrc = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json'

function obj2esm (obj) {
  return `// Generated, don't edit
export default ${JSON.stringify(obj, null, 2)}
`
}

const response = await fetch(emojiSrc)

if (!response.ok) throw new Error(`Bad response code: ${response.status}`)

const defs = await response.json()

// Drop aliases without names (with names "uXXXX")
defs.forEach(def => {
  def.aliases = def.aliases.filter(a => !/^u[0-9a-b]{4,}$/i.test(a))
})

/* // Write chars in one string, to quickly select supported in editor
const text = defs.map(function (data) {
  return data.emoji || '';
}).join('');
require('fs').writeFileSync('visible.txt', text, 'utf8'); */

//
// Write full set
//

const emojies = {}

defs.forEach(def => {
  def.aliases.forEach(alias => {
    emojies[alias] = def.emoji
  })
})

writeFileSync(new URL('../lib/data/full.mjs', import.meta.url), obj2esm(emojies), 'utf8')

//
// Write light set
//

const visible = readFileSync(new URL('visible.txt', import.meta.url), 'utf8')

const emoji_light = {}

defs.forEach(def => {
  def.aliases.forEach(alias => {
    if (visible.includes(def.emoji.replace(/\uFE0F/g, ''))) {
      emoji_light[alias] = def.emoji
    }
  })
})

writeFileSync(new URL('../lib/data/light.mjs', import.meta.url), obj2esm(emoji_light), 'utf8')

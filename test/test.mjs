import markdownit from 'markdown-it'
import generate from 'markdown-it-testgen'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert'

import { bare as emoji_bare, light as emoji_light, full as emoji_full } from '../index.mjs'

// data for integrity check testing
import emojies_shortcuts from '../lib/data/shortcuts.mjs'
import emojies_defs from '../lib/data/full.mjs'
import emojies_defs_light from '../lib/data/light.mjs'

describe('markdown-it-emoji', function () {
  let md = markdownit().use(emoji_full)
  generate(fileURLToPath(new URL('fixtures/default', import.meta.url)), { header: true }, md)

  generate(fileURLToPath(new URL('fixtures/full.txt', import.meta.url)), { header: true }, md)

  md = markdownit().use(emoji_full, {
    defs: {
      one: '!!!one!!!',
      fifty: '!!50!!'
    },
    shortcuts: {
      fifty: [':50', '|50'],
      one: ':uno'
    }
  })
  generate(fileURLToPath(new URL('fixtures/options.txt', import.meta.url)), { header: true }, md)

  md = markdownit().use(emoji_full, { enabled: ['smile', 'grin'] })
  generate(fileURLToPath(new URL('fixtures/whitelist.txt', import.meta.url)), { header: true }, md)

  md = markdownit({ linkify: true }).use(emoji_full)
  generate(fileURLToPath(new URL('fixtures/autolinks.txt', import.meta.url)), { header: true }, md)
})

describe('markdown-it-emoji-light', function () {
  let md = markdownit().use(emoji_light)
  generate(fileURLToPath(new URL('fixtures/default', import.meta.url)), { header: true }, md)

  generate(fileURLToPath(new URL('fixtures/light.txt', import.meta.url)), { header: true }, md)

  md = markdownit().use(emoji_light, {
    defs: {
      one: '!!!one!!!',
      fifty: '!!50!!'
    },
    shortcuts: {
      fifty: [':50', '|50'],
      one: ':uno'
    }
  })
  generate(fileURLToPath(new URL('fixtures/options.txt', import.meta.url)), { header: true }, md)

  md = markdownit().use(emoji_light, { enabled: ['smile', 'grin'] })
  generate(fileURLToPath(new URL('fixtures/whitelist.txt', import.meta.url)), { header: true }, md)

  md = markdownit({ linkify: true }).use(emoji_full)
  generate(fileURLToPath(new URL('fixtures/autolinks.txt', import.meta.url)), { header: true }, md)
})

describe('markdown-it-emoji-bare', function () {
  let md = markdownit().use(emoji_bare)
  generate(fileURLToPath(new URL('fixtures/bare.txt', import.meta.url)), { header: true }, md)

  md = markdownit().use(emoji_bare, {
    defs: {
      one: '!!!one!!!',
      fifty: '!!50!!'
    },
    shortcuts: {
      fifty: [':50', '|50'],
      one: ':uno'
    }
  })
  generate(fileURLToPath(new URL('fixtures/options.txt', import.meta.url)), { header: true }, md)
})

describe('integrity', function () {
  it('all shortcuts should exist', function () {
    Object.keys(emojies_shortcuts).forEach(function (name) {
      assert(emojies_defs[name], "shortcut doesn't exist: " + name)
    })
  })

  it('no chars with "uXXXX" names allowed', function () {
    Object.keys(emojies_defs).forEach(function (name) {
      if (/^u[0-9a-b]{4,}$/i.test(name)) {
        throw Error('Name ' + name + ' not allowed')
      }
    })
  })

  it('all light chars should exist', function () {
    const visible = readFileSync(new URL('../support/visible.txt', import.meta.url), 'utf8')

    const available = Object.keys(emojies_defs_light).map(function (k) {
      return emojies_defs_light[k].replace(/\uFE0F/g, '')
    })

    let missed = ''

    Array.from(visible).forEach(function (ch) {
      if (available.indexOf(ch) < 0) missed += ch
    })

    if (missed) {
      throw new Error('Characters ' + missed + ' missed.')
    }
  })
})

describe('renderer rules', function () {
  const md = markdownit().use(emoji_full)

  md.renderer.rules.emoji = function (tokens, idx) {
    return '<span class="emoji emoji_' + tokens[idx].markup + '">' + tokens[idx].content + '</span>'
  }

  generate(fileURLToPath(new URL('fixtures/renderer.txt', import.meta.url)), { header: true }, md)
})

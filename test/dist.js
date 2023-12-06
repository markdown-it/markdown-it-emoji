'use strict'

const markdownit = require('markdown-it')
const assert = require('assert')

describe('dist', () => {
  it('UMD full', () => {
    const md = markdownit().use(require('../dist/markdown-it-emoji.js'))

    assert.strictEqual(md.render(':100:'), '<p>💯</p>\n')
  })

  it('UMD light', () => {
    const md = markdownit().use(require('../dist/markdown-it-emoji-light.js'))
    // ignore non-base emoji
    assert.strictEqual(md.render(':100:'), '<p>:100:</p>\n')
    // convert base emoji
    assert.strictEqual(md.render(':smile:'), '<p>😄</p>\n')
  })

  it('UMD bare', () => {
    const md = markdownit().use(require('../dist/markdown-it-emoji-bare.js'), {
      defs: {
        one: '!!!one!!!'
      }
    })
    // ignore non-base emoji
    assert.strictEqual(md.render(':100:'), '<p>:100:</p>\n')
    assert.strictEqual(md.render(':smile:'), '<p>:smile:</p>\n')

    assert.strictEqual(md.render(':one:'), '<p>!!!one!!!</p>\n')
  })

  it('CJS full', () => {
    const md = markdownit().use(require('../dist/full.cjs.js'))

    assert.strictEqual(md.render(':100:'), '<p>💯</p>\n')
  })

  it('CJS light', () => {
    const md = markdownit().use(require('../dist/light.cjs.js'))
    // ignore non-base emoji
    assert.strictEqual(md.render(':100:'), '<p>:100:</p>\n')
    // convert base emoji
    assert.strictEqual(md.render(':smile:'), '<p>😄</p>\n')
  })

  it('CJS bare', () => {
    const md = markdownit().use(require('../dist/bare.cjs.js'), {
      defs: {
        one: '!!!one!!!'
      }
    })
    // ignore non-base emoji
    assert.strictEqual(md.render(':100:'), '<p>:100:</p>\n')
    assert.strictEqual(md.render(':smile:'), '<p>:smile:</p>\n')

    assert.strictEqual(md.render(':one:'), '<p>!!!one!!!</p>\n')
  })

  it('CJS index', () => {
    const idx = require('../dist/index.cjs.js')

    assert(typeof idx.full, 'function')
    assert(typeof idx.light, 'function')
    assert(typeof idx.bare, 'function')
  })
})

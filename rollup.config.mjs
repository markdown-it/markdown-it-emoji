import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(new URL('package.json', import.meta.url)))

function umdConfig (input, suffix) {
  return {
    input,
    output: [
      {
        file: `dist/markdown-it-emoji${suffix}.js`,
        format: 'umd',
        name: 'markdownitEmoji'
      },
      {
        file: `dist/markdown-it-emoji${suffix}.min.js`,
        format: 'umd',
        name: 'markdownitEmoji',
        plugins: [
          terser({
            format: { ascii_only: true }
          })
        ]
      }
    ],
    plugins: [
      nodeResolve(),
      {
        banner () {
          return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`
        }
      }
    ]

  }
}

function cjsConfig (input, suffix) {
  return {
    input,
    output: [
      {
        file: `dist/${suffix}.cjs.js`,
        format: 'cjs'
      }
    ],
    plugins: [nodeResolve()]
  }
}

export default [
  umdConfig('./lib/full.mjs', ''),
  umdConfig('./lib/light.mjs', '-light'),
  umdConfig('./lib/bare.mjs', '-bare'),
  cjsConfig('./lib/full.mjs', 'full'),
  cjsConfig('./lib/light.mjs', 'light'),
  cjsConfig('./lib/bare.mjs', 'bare'),
  cjsConfig('./index.mjs', 'index')
]

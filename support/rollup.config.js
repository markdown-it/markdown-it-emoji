import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from '../package.json';
import { terser } from 'rollup-plugin-terser';


const plugins = [
  nodeResolve({ preferBuiltins: true }),
  commonjs(),
  json({ namedExports: false }),
  {
    banner() {
      return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`;
    }
  }
];

const plugins_minify = [
  terser({
    format: {
      ascii_only: true,
    }
  })
];


export default [
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/markdown-it-emoji.js',
        format: 'umd',
        name: 'markdownitEmoji'
      },
      {
        file: 'dist/markdown-it-emoji.min.js',
        format: 'umd',
        name: 'markdownitEmoji',
        plugins: plugins_minify
      }
    ],
    plugins: plugins
  },
  {
    input: 'light.js',
    output: [
      {
        file: 'dist/markdown-it-emoji-light.js',
        format: 'umd',
        name: 'markdownitEmoji'
      },
      {
        file: 'dist/markdown-it-emoji-light.min.js',
        format: 'umd',
        name: 'markdownitEmoji',
        plugins: plugins_minify
      }
    ],
    plugins: plugins
  },
  {
    input: 'bare.js',
    output: [
      {
        file: 'dist/markdown-it-emoji-bare.js',
        format: 'umd',
        name: 'markdownitEmoji'
      },
      {
        file: 'dist/markdown-it-emoji-bare.min.js',
        format: 'umd',
        name: 'markdownitEmoji',
        plugins: plugins_minify
      }
    ],
    plugins: plugins
  }
];

'use strict';


var path        = require('path');
var fs          = require('fs');
var assert      = require('assert');


var markdownit  = require('markdown-it');
var generate    = require('markdown-it-testgen');

var emoji       = require('..');
var emoji_light = require('../light');


describe('markdown-it-emoji', function () {
  var md;


  md = markdownit().use(emoji);
  generate(path.join(__dirname, 'fixtures/default'), { header: true }, md);

  generate(path.join(__dirname, 'fixtures/full.txt'), { header: true }, md);


  md = markdownit().use(emoji, {
    defs: {
      one: '!!!one!!!',
      fifty: '!!50!!'
    },
    shortcuts: {
      fifty: [ ':50', '|50' ],
      one: ':uno'
    }
  });
  generate(path.join(__dirname, 'fixtures/options.txt'), { header: true }, md);


  md = markdownit().use(emoji, { enabled: [ 'smile', 'grin' ] });
  generate(path.join(__dirname, 'fixtures/whitelist.txt'), { header: true }, md);

  md = markdownit({ linkify: true }).use(emoji);
  generate(path.join(__dirname, 'fixtures/autolinks.txt'), { header: true }, md);
});


describe('markdown-it-emoji-light', function () {
  var md;

  md = markdownit().use(emoji_light);
  generate(path.join(__dirname, 'fixtures/default'), { header: true }, md);

  generate(path.join(__dirname, 'fixtures/light.txt'), { header: true }, md);

  md = markdownit().use(emoji_light, {
    defs: {
      one: '!!!one!!!',
      fifty: '!!50!!'
    },
    shortcuts: {
      fifty: [ ':50', '|50' ],
      one: ':uno'
    }
  });
  generate(path.join(__dirname, 'fixtures/options.txt'), { header: true }, md);


  md = markdownit().use(emoji_light, { enabled: [ 'smile', 'grin' ] });
  generate(path.join(__dirname, 'fixtures/whitelist.txt'), { header: true }, md);

  md = markdownit({ linkify: true }).use(emoji);
  generate(path.join(__dirname, 'fixtures/autolinks.txt'), { header: true }, md);
});


var emojies_shortcuts  = require('../lib/data/shortcuts');
var emojies_defs       = require('../lib/data/full.json');
var emojies_defs_light = require('../lib/data/light.json');

describe('integrity', function () {

  it('all shortcuts should exist', function () {
    Object.keys(emojies_shortcuts).forEach(function (name) {
      assert(emojies_defs[name], "shortcut doesn't exist: " + name);
    });
  });

  it('no chars with "uXXXX" names allowed', function () {
    Object.keys(emojies_defs).forEach(function (name) {
      if (/^u[0-9a-b]{4,}$/i.test(name)) {
        throw Error('Name ' + name + ' not allowed');
      }
    });
  });

  it('all light chars should exist', function () {
    var visible = fs.readFileSync(path.join(__dirname, '../support/visible.txt'), 'utf8');

    var available = Object.keys(emojies_defs_light).map(function (k) {
      return emojies_defs_light[k].replace(/\uFE0F/g, '');
    });

    var missed = '';

    Array.from(visible).forEach(function (ch) {
      if (available.indexOf(ch) < 0) missed += ch;
    });

    if (missed) {
      throw new Error('Characters ' + missed + ' missed.');
    }
  });

});

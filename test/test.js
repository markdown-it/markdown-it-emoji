'use strict';


var path = require('path');


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
});

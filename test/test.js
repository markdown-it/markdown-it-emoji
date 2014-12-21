'use strict';


var path = require('path');


var markdownit  = require('markdown-it');
var generate    = require('markdown-it-testgen');

var emoji       = require('..');
var emoji_light = require('../light');


describe('markdown-it-emoji', function () {
  var md;


  md = markdownit().use(emoji);
  generate(path.join(__dirname, 'fixtures/default'), md);

  generate(path.join(__dirname, 'fixtures/full.txt'), md);


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
  generate(path.join(__dirname, 'fixtures/options.txt'), md);


  md = markdownit().use(emoji, { enabled: [ 'smile', 'haha' ] });
  generate(path.join(__dirname, 'fixtures/whitelist.txt'), md);
});


describe('markdown-it-emoji-light', function () {
  var md;

  md = markdownit().use(emoji_light);
  generate(path.join(__dirname, 'fixtures/default'), md);

  generate(path.join(__dirname, 'fixtures/light.txt'), md);

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
  generate(path.join(__dirname, 'fixtures/options.txt'), md);


  md = markdownit().use(emoji_light, { enabled: [ 'smile', 'haha' ] });
  generate(path.join(__dirname, 'fixtures/whitelist.txt'), md);
});

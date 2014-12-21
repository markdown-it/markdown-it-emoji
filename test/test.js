'use strict';


var path = require('path');


var markdownit = require('markdown-it');
var emoji      = require('..');
var generate   = require('markdown-it-testgen');


describe('markdown-it-emoji', function () {
  var md;


  md = markdownit().use(emoji);
  generate(path.join(__dirname, 'fixtures/default'), md);


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

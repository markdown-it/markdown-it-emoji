'use strict';


var assert            = require('assert');
var emojies_defs      = require('../lib/data/full.json');
var emojies_shortcuts = require('../lib/data/shortcuts');


describe('shortcuts', function () {
  it('make sure all shortcuts exist', function () {
    Object.keys(emojies_shortcuts).forEach(function (name) {
      assert(emojies_defs[name], "shortcut doesn't exist: " + name);
    });
  });
});

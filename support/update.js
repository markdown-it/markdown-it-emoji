#!/usr/bin/env node

'use strict';

/*eslint-disable no-console*/

var p        = require('path');
var fs       = require('fs');
var _        = require('lodash');
var request  = require('request');

var emojiSrc = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';

request(emojiSrc, function (err, response, body) {
  if (err || response.statusCode !== 200) {
    throw new Error('Failed to load emojies map');
  }

  var defs = JSON.parse(body);

  /*// Write chars in one string, to quickly select supported in editor
  var text = defs.map(function (data) {
    return data.emoji || '';
  }).join('');
  require('fs').writeFileSync('visible.txt', text, 'utf8');*/

  var emojies = {};

  defs.forEach(function (def) {
    if (!def.emoji) { return; }

    def.aliases.forEach(function (alias) {
      emojies[alias] = def.emoji;
    });
  });

  fs.writeFileSync(p.join(__dirname, '../lib/data/full.json'), JSON.stringify(emojies, null, 2), 'utf8');

  var visible = fs.readFileSync(p.join(__dirname, 'visible.txt'), 'utf8');

  var emoji_light = _.omitBy(emojies, function (val) {
    return visible.indexOf(val) < 0;
  });
  fs.writeFileSync(p.join(__dirname, '../lib/data/light.json'), JSON.stringify(emoji_light, null, 2), 'utf8');

  console.log(emojies);
});

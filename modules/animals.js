const request = require('request');
require('dotenv').config();

var chien = function (callback) {
  var url = 'https://lorempixel.com/1280/720/cats'
  callback('Plus dispo....',null)
}

module.exports = {
  chien
}
const request = require('request');
const wikiquote = require('wikiquote')

var chuck = function (callback) {
  var url = 'https://api.chucknorris.io/jokes/random'

  request(url, function (err, response, body) {
      try {
          var result = JSON.parse(body);
          var fact = result.value;
          callback(null, fact);
      } catch (e) {
          callback(e);
      }
  })
}

var quote = async function (callback) {
    wikiquote.searchPeople('steve jobs')
        .then(page => wikiquote.getRandomQuote(page[0].title))
        .then(quote => {
            console.log(quote)
            callback(null, quote)
        })
        .catch(e => {
            if (e) {
                console.error(e);
                callback(e)
            }
        })
}

module.exports = {chuck, quote}
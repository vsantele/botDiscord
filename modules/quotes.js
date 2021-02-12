const got = require('got');
const wikiquote = require('wikiquote')

async function chuck(callback) {
  const url = 'https://api.chucknorris.io/jokes/random'

  try {
    const response = await got(url)
    var result = JSON.parse(response.body);
    var fact = result.value;
    callback(null, fact);
  } catch (e) {
    callback(e);
  }
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
const request = require('request');
const cheerio = require('cheerio')
require('dotenv').config();

function getWord(word) {
  return new Promise((resolve, reject) => {
    request.get(`https://www.larousse.fr/dictionnaires/francais/${word}`, function (
      error,
      response,
      data
    ) {
      if (error) {
        reject(error)
      } else {
        const $ = cheerio.load(data);
        if ($('section.corrector > p').is('.err')) {
          reject('Error, mot inconnu')
        } else if ($('section').is('section.corrector')) {
          resolve(getWord($('.corrector > ul').children().first().text()))
        } else {
          let definitions = []
          $('.Definitions').children().each(function (i, elem) {
            definitions.push($(this).text())
          })
          let locutions = []
          $('.ListeLocutions').children().each(function (i, elem) {
            locutions.push($(this).text())
          })
          resolve({
            word,
            definitions,
            locutions
          });
        }
      }
    });
  })
}
async function dict(arg) {
  try {
    let defs = await getWord(arg)
    let res = `${defs.word}: \n  Définition${defs.definitions.length > 1 ? 's' : ''}:\n`
    defs.definitions.forEach((def) => {
      res += '  - ' + def + '\n'
    })
    if (defs.locutions.length >= 1) {
      res += `  Locution${defs.locutions.length > 1 ? 's' : ''}:\n`
      defs.locutions.forEach((loc) => {
        res += '  - ' + loc + '\n'
      })
    }
    return res
  } catch (error) {
    return error
  }
}
  
module.exports = {
  dict
}
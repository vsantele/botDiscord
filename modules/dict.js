const got = require("got")
const cheerio = require("cheerio")
require("dotenv").config()

async function getWord(word) {
  const response = await got(
    `https://www.larousse.fr/dictionnaires/francais/${word}`
  )
  const data = response.body
  const $ = cheerio.load(data)
  if ($("section.corrector > p").is(".err")) {
    throw new Error("Error, mot inconnu")
  } else if ($("section").is("section.corrector")) {
    return getWord($(".corrector > ul").children().first().text())
  } else {
    let definitions = []
    $(".Definitions")
      .children()
      .each(function (i, elem) {
        definitions.push($(this).text())
      })
    let locutions = []
    $(".ListeLocutions")
      .children()
      .each(function (i, elem) {
        locutions.push($(this).text())
      })
    return {
      word,
      definitions,
      locutions,
    }
  }
}
async function dict(arg) {
  try {
    let defs = await getWord(arg)
    let res = `${defs.word}: \n  Définition${
      defs.definitions.length > 1 ? "s" : ""
    }:\n`
    defs.definitions.forEach((def) => {
      res += "  - " + def + "\n"
    })
    if (defs.locutions.length >= 1) {
      res += `  Locution${defs.locutions.length > 1 ? "s" : ""}:\n`
      defs.locutions.forEach((loc) => {
        res += "  - " + loc + "\n"
      })
    }
    return res
  } catch (error) {
    console.log(error)
    return "Une erreur s'est produire"
  }
}

module.exports = {
  dict,
}

const RandomOrg = require('random-org')

require('dotenv').config();

const randomOrg = new RandomOrg({
  apiKey: process.env.RANDOM_TOKEN
})

async function random(args) {
  return randomOrg.generateIntegers({
    min: args[0] ? args[0] : 0,
    max: args[1] ? args[1] : 10,
    n: args[2] ? args[2] : 1
  });
}

module.exports = {
  random
}
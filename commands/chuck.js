const chuck = require('../modules/quotes.js').chuck

module.exports = {
  name: 'chuck',
  description: 'Donne des facts de Chuck Norris',
  execute(message, args) {
    chuck(function (err, fact) {
      if (err) throw err;
      message.channel.send(`${fact}`)
    })
  }
}
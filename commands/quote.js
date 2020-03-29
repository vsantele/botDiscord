const quote = require('../modules/quotes.js').quote

module.exports = {
  name: 'quote',
  description: 'Donne des citations de Steve Jobs',
  execute(message, args) {
    quote(function (err, quote) {
      if (err) throw err;
      message.reply(`${quote}`)
    })
  }
}
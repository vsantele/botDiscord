const dict = require('../modules/dict.js').dict

module.exports = {
  name: 'def',
  aliases: ['definition', 'définition'],
  description: 'Donne la définition d\'un mot',
  usage: '<mot>',
  async execute(message, args) {
    try {
      const res = await dict(args[1])
      msg.channel.send(res)
    } catch (e) {
      console.error('e :', e);
      msg.channel.send(`Il y a eu une erreur...`)
    }
  }
}

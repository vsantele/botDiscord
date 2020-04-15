const random = require('../modules/random.js').random

module.exports = {
  name: 'random',
  description: 'tire un ou plusieurs nombres random',
  args: true,
  usage: '<min> <max> <nb>',
  async execute(message, args) {
    let result = await random(args)
    console.log(result)
    message.channel.send(`le${args[2] > 1 ? "s " + args[2] : ""} nombre${args[2] > 1 ? 's' : ''} entre ${args[0]} et ${args[1]} aléatoire${args[2] > 1 ? 's' : ''} ${args[2] > 1 ? 'sont' : 'est'}: \n ${result}`)
  }
}
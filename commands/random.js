const random = require('../modules/random.js').random

module.exports = {
  name: 'random',
  description: 'tire un ou plusieurs nombres random',
  args: true,
  usage: '<min> <max> <nb>',
  async execute(message, args) {
    message.channel.send(await random(args))
  }
}
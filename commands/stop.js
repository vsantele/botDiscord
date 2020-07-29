module.exports = {
  name: 'stop',
  description: 'Arrête le bot audio',
  aliases: ['tg'],
  execute(message, args, options) {
    const { audio } = options
    audio.stop(message)
  }
}
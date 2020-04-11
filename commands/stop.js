module.exports = {
  name: 'stop',
  description: 'Arrête le bot audio',
  execute(message, args, options) {
    const { audio } = options
    audio.stop(message)
  }
}
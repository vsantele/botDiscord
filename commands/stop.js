module.exports = {
  name: 'stop',
  description: 'Arrête le bot audio',
  execute(message, args, audio) {
    audio.stop(message)
  }
}
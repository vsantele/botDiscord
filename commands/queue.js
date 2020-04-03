
module.exports = {
  name: 'queue',
  description: 'Donne les chansons dans la file d\'attente',
  execute(message, args, audio) {
    message.channel.send(audio.getQueue())
  }
}
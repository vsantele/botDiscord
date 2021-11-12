module.exports = {
  name: "queue",
  description: "Donne les chansons dans la file d'attente",
  execute(message, args, options) {
    const { audio } = options
    message.channel.send(audio.getQueue())
  },
}

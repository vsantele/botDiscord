module.exports = {
  name: 'debug',
  description: 'M\'aide pour le débug',
  users: ["94876363479056384"],
  execute(message, args) {
    message.channel.send("debug: ", args)
  }
}

class Message {
  constructor(channel) {
    this.channel = channel || null
  }
  send(channel, msg) {
    channel.send(msg)
  }
}

module.exports = {
  Message,
}

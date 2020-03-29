const Message = require('./send.js').Message

class Guilds {
  constructor() {
    this.list = new Map()
  }
  get(guildId) {
    if (this.list.has(guildId)) {
      return this.list.get(guildId)
    } else {
      this.list.set(guildId, new Message())
      return this.list.get(guildId)
    }
  }
}
module.exports = {
  Guilds
}
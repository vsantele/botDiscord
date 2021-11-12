const rec = require("../modules/audio/snowboy").rec
const fs = require("fs")
const sox = require("sox-stream")

const { Readable } = require("stream")
class Silence extends Readable {
  _read() {
    this.push(Buffer.from([0xf8, 0xff, 0xfe]))
  }
}

module.exports = {
  name: "rec",
  description: "enregistre la voix des personnes dans le channel",
  async execute(message, args, options) {
    const { audio } = options
    if (!audio.queue.songs.length) {
      const song = {
        title: "Silence",
        src: new Silence(),
        type: "silence",
      }
      await audio.execute(message, song)
    }
    let receiver = audio.queue.connection.receiver
    receiver.on("speaking", (user, speaking) => {
      if (speaking) {
        message.channel.send(`J'écoute ${user}`)
        const audioStream = receiver.createStream(user, {
          mode: "pcm",
          end: "manual",
        })
        audioStream.pipe(rec)
      }
    })
  },
}

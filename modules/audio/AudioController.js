const ytdl = require('ytdl-core');
const fs = require('fs')
const HttpsProxyAgent = require('https-proxy-agent')

const agent = HttpsProxyAgent({
  host: '54.37.14.65',
  port: 3129
})

class AudioController {
  constructor(message, event) {
    this.guildID = message.guild.id;
    this.queue = {
      textChannel: message.channel,
      voiceChannel: message.member.voice ? message.member.voice.channel : null,
      connection: null,
      songs: [],
      volume: 0.5,
      playing: true,
    }
    this.rec = false
    this.event = event
  }

  async execute(message, song, channel) {
    const voiceChannel = channel || message.member.voice.channel
    if (!voiceChannel) return message.channel.send('Vous devez être dans un channel vocal pour diffuser quelque chose!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send(`J'ai besoin de permissions pour pouvoir me connecter et parler!`);
    }
    if (this.queue.voiceChannel === null) this.queue.voiceChannel = voiceChannel;
    this.queue.textChannel = message.channel
  
    if (!this.queue.songs.length) {  
      this.queue.songs.push(song);
  
      try {
        // console.log("queue:",queueContruct.songs[0])
        var connection = await voiceChannel.join();
        // console.log('connection :', connection);
        this.queue.connection = connection;
        this.play(this.queue.songs[0]);
        return
      } catch (err) {
        throw new Error(err.message)
      }
    } else {
      this.queue.songs.push(song);
      // console.log(this.queue.songs);
      return message.channel.send(`${song.title} a été ajouté à la file d'attente!`);
    }
  }

  skip(message) {
    if (!message.member.voice.channel) return message.channel.send('Vous devez être dans un channel vocal!');
    if (!this.queue) return message.channel.send(`Il n'y a rien à passer!`);
    if (this.queue.connection && this.queue.connection.dispatcher) this.queue.connection.dispatcher.end();
  }
  stop(message) {
    if (!message.member.voice.channel) return message.channel.send('Vous devez être dans un channel vocal!');
    this.queue.songs = [];
    if (!this.rec) {
      if (this.queue.connection && this.queue.connection.dispatcher) this.queue.connection.dispatcher.end();
    }
  }
  play(song) {
    try {
      if (!song) {
        if (!this.rec) {
          this.queue.voiceChannel.leave();
          // this.event.emit('delete', this.guildID)
        }
        return;
      }
      console.log(song);
      let dispatcher;
      switch (song.type) {
        case "youtube":
          // const stream = ytdl(song.src, { requestOptions: { agent } });
          const stream = ytdl(song.src, {type: "audioonly"})
          dispatcher = this.queue.connection.play(stream);
          dispatcher.setVolumeLogarithmic(this.queue.volume);
          break;
        case "file":
          dispatcher = this.queue.connection.play(
            fs.createReadStream(song.src),
            {
              type: "ogg/opus"
            }
          );
          dispatcher.setVolumeLogarithmic(1)
          break;
        case "broadcast":
          dispatcher = this.queue.connection.play(song.src)
          dispatcher.setVolumeLogarithmic(this.queue.volume);
          break;
        case "stream":
          dispatcher = this.queue.connection.play(song.src)
          dispatcher.setVolumeLogarithmic(this.queue.volume*1.75);
          break;
        case "silence":
          dispatcher = this.queue.connection.play(song.src, { type: 'opus' })
          dispatcher.setVolumeLogarithmic(this.queue.volume);
      }
      dispatcher
        .on("finish", () => {
          console.log("Music ended!");
          this.queue.songs.shift();
          this.play(this.queue.songs[0]);
        })
        .on("error", error => {
          console.error(error);
        });
      
      if (this.queue.songs[0].type === "file " || this.queue.songs[0].type === "youtube") {
        this.queue.textChannel.send(`"${this.queue.songs[0].title}" est en train d'être joué`)
      } 
    } catch (err){
      console.error(err)
      this.queue.textChannel.send(`Une erreur est survenue lors de la lecture...`)
    }
    
  }
  volume(vol) {
    vol /= 100
    this.queue.volume = vol
    if (this.queue.connection) this.queue.connection.dispatcher.setVolumeLogarithmic(Math.min(2, Math.max(0,vol)))
  }
  pause() {
    if (this.queue.connection && this.queue.connection.dispatcher) {
      if (this.queue.connection.dispatcher.paused) this.queue.connection.dispatcher.resume()
      else this.queue.connection.dispatcher.pause(true)
    }
  }
  resume() {
    if (this.queue.connection && this.queue.connection.dispatcher) this.queue.connection.dispatcher.resume()
  }
  getQueue() {
    let result = `Prochaines musiques à jouer:\n`
    this.queue.songs.forEach((song, index) => {
      if (index === 0) return
      result += `${index}. "${song.title}"\n`
    })
    return result
  }
  length() {
    return this.queue.songs.length
  }
  remove(index) {
    if (index === 0) throw new Error('Vous ne pouvez pas supprimer le premier son, utilisez `!skip` à la place')
    if (index >= this.queue.songs.length) throw new Error(`Numéro invalide`)
    this.queue.songs.splice(index, 1)
  }
  changeQueue(queue) {
    if (queue[0].src === this.queue.songs[0].src) {
      this.queue.songs = queue;
    } else {
      throw new Error('You cannot change the first song...')
    }
  }
} 

module.exports = AudioController
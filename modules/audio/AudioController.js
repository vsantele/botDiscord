const ytdl = require('ytdl-core');
const fs = require('fs')

class AudioController {
  constructor(message) {
    this.guildID = message.guild.id;
    this.queue = {
      textChannel: message.channel,
      voiceChannel: message.member.voice ? message.member.voice.channel : null,
      connection: null,
      songs: [],
      volume: 0.5,
      playing: true,
    }
  }

  async execute(message, song) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }
    if (this.queue.voiceChannel === null) this.queue.voiceChannel = voiceChannel;
    
  
    if (!this.queue.songs.length) {  
      this.queue.songs.push(song);
  
      try {
        // console.log("queue:",queueContruct.songs[0])
        var connection = await voiceChannel.join();
        // console.log('connection :', connection);
        this.queue.connection = connection;
        this.play(this.queue.songs[0]);
      } catch (err) {
        throw new Error(err.message)
      }
    } else {
      this.queue.songs.push(song);
      console.log(this.queue.songs);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }

  skip(message) {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!this.queue) return message.channel.send('There is no song that I could skip!');
    this.queue.connection.dispatcher.destroy();
  }
  stop(message) {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    this.queue.songs = [];
    this.queue.connection.dispatcher.destroy();
    this.queue.voiceChannel.leave();
  }
  play(song) {
    try {
      if (!song) {
        this.queue.voiceChannel.leave();
        return;
      }
      console.log(song);
      let dispatcher;
      switch (song.type) {
        case "youtube":
          dispatcher = this.queue.connection.play(ytdl(song.src));
          break;
        case "file":
          dispatcher = this.queue.connection.play(
            fs.createReadStream(song.src),
            {
              type: "ogg/opus"
            }
          );
          break;
        case "broadcast":
          dispatcher = this.queue.connection.play(song.src)
          break;
        case "stream":
          dispatcher = this.queue.connection.play(song.src)
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
      dispatcher.setVolumeLogarithmic(this.queue.volume);
    } catch (err){
      console.error(err)
      this.queue.textChannel.send(`Une erreur est survenur lors de la lecture...`)
    }
    
  }
  volume(vol) {
    vol /= 100
    this.queue.volume = vol
    if (this.queue.connection) this.queue.connection.dispatcher.setVolumeLogarithmic(Math.min(2, Math.max(0,vol)))
  }
} 

module.exports = {
  AudioController
}
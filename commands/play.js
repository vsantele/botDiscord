const ytdl = require("ytdl-core");

module.exports = {
  name: 'play',
  description: 'lance une vidéo youtube dans le bot',
  async execute(message, args, audio) {
    try {
      
      const songInfo = await ytdl.getInfo(args[0]);
      const song = {
        title: songInfo.title,
        src: songInfo.video_url,
        type: 'youtube'
      };
      audio.execute(message, song);
    } catch (err) {
      console.error(err)
      message.channel.send(`Il y a eu une erreur avec la commande ${this.name}`)
    }
  }
}
const ytdl = require("ytdl-core");
const search = require('../modules/audio/search').youtube

module.exports = {
  name: 'play',
  description: 'lance une vidéo youtube dans le bot',
  async execute(message, args, options) {
    try {
      const {audio} = options
      let url
      const regexYT = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?/
      let res = args[0].match(regexYT)
      if (res !== null) {
        url = res[0]
      } else {
        let result = await search(args.join(' '))
        console.log(result.items)
        url = result.items[0].id.videoId
      }
      const songInfo = await ytdl.getInfo(url);
      const song = {
        title: songInfo.title,
        src: songInfo.video_url,
        type: 'youtube'
      };
      // audio.execute(message, { title: 'Rick Roll', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube'})
      audio.execute(message, song);
    } catch (err) {
      console.error(err)
      message.channel.send(`Il y a eu une erreur avec la commande ${this.name}`)
    }
  }
}
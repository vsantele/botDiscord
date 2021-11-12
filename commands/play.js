const ytdl = require("ytdl-core")
const search = require("../modules/audio/search").youtube

module.exports = {
  name: "play",
  description: "lance une vidéo youtube dans le bot",
  args: true,
  async execute(message, args, options) {
    try {
      const { audio } = options
      let url
      const regexYT =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?/
      let res = args[0].match(regexYT)
      if (res !== null) {
        url = res[0]
      } else {
        let result = await search(args.join(" "))
        if (result.items.length) url = result.items[0].id.videoId
        else throw "No result"
      }
      const songInfo = await ytdl.getInfo(url)
      const song = {
        title: songInfo.videoDetails.title,
        src: songInfo.videoDetails.video_url,
        type: "youtube",
      }
      // audio.execute(message, { title: 'Rick Roll', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube'})
      audio.execute(message, song)
    } catch (err) {
      console.error(err)
      if (err === "No result") return message.channel.send(`Pas de résultat...`)
      message.channel.send(`Il y a eu une erreur avec la commande ${this.name}`)
    }
  },
}

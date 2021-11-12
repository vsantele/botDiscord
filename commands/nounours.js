const path = require("path")
const Discord = require("discord.js")
const { search, all } = require("../database").read

module.exports = {
  name: "nounours",
  description: "Nounours dominera le monde",
  async execute(message, args, options) {
    const { audio } = options
    if (!args.length) {
      const phrases = await all("nounours")
      let res = `Listes des phrases disponibles:\n `
      phrases.forEach((phrase) => {
        res += ` - **${phrase.title}**: mots clés: [`
        res += phrase.keywords.map((keyword) => `**${keyword}**`).join(", ")
        res += `]\n`
      })
      message.channel.send(res)
    } else {
      const name = args.join(" ")
      const phrase = await search("nounours", { keywords: name })
      if (!phrase)
        return message.channel.send(`\`${name}\` n'existe pas encore...`)
      const song = {
        title: phrase.title,
        src: path.join(__dirname, phrase.src),
        type: "file",
      }
      audio.execute(message, song)
    }
  },
}

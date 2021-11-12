const dict = require("../modules/dict.js").dict

module.exports = {
  name: "def",
  aliases: ["definition", "définition"],
  description: "Donne la définition d'un mot",
  usage: "<mot>",
  async execute(message, args) {
    try {
      const res = await dict(args.join(" "))
      message.channel.send(res, { split: true })
    } catch (e) {
      console.error("e :", e)
      message.channel.send(`Il y a eu une erreur...`)
    }
  },
}

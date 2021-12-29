const omg = require("../modules/omgserv.js").omg

module.exports = {
  name: "minecraft",
  aliases: ["omg", "mc", "omgserv"],
  description: "Donne des informations sur le server omgserv",
  cooldown: 60,
  async execute(message, args) {
    try {
      const status = await omg()
      let res = ""
      if (status.isOnline) {
        res = `Le serveur est actuellement en ligne avec ${
          status.nbPlayers
        } joueur${status.nbPlayers === 1 ? "" : "s"}. CPU utilisé à ${
          status.cpu
        }%`
      } else {
        res = "Le serveur est actuellement hors ligne"
      }
      message.channel.send(res)
    } catch (error) {
      console.error(error)
      message.channel.send(`Il y a eu une erreur avec la commande ${this.name}`)
    }
  },
}

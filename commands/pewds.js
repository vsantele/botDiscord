const diffSub = require("../modules/stats.js").diffSub

module.exports = {
  name: "pewds",
  description:
    "Donne la différence d'abonnés et de vues par rapport à T-Series",
  execute(message, args) {
    diffSub((err, diff) => {
      if (err) throw err
      message.reply(`${diff}`)
    })
  },
}

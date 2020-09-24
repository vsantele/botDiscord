// const {
//   search,
//   all
// } = require('../database').read
// const update = require('../database').update
// module.exports = {
//   name: 'gay',
//   aliases: ['gays'],
//   description: 'Comptabilise le nombre de gayPasses de chaque joueur',
//   usage: '<add|remove|show|list> [<pseudo> <nombre>]',
//   async execute(message, args, options) {
//     let user = null
//     if (args[1]) user = await search("gayPasses", {
//       pseudo: args[1].toLowerCase()
//     })
//     switch (args[0]) {
//       case "add": {
//         if (!args[1]) throw new Error('missing Args')
//         if (user) {
//           const ok = await update("gayPasses", user._id, {
//             $inc: {
//               gay: 1
//             }
//           })
//           if (ok) return message.channel.send(`score update à ${user.gay + 1}`)
//           throw new Error("update failed")
//         } else {
//           return message.channel.send(`Joueur inexistant`)
//         }
//       }
//       case "remove": {
//         if (!args[1]) throw new Error('missing Args')
//         if (user) {
//           const ok = await update("gayPasses", user._id, {
//             $inc: {
//               gay: -1
//             }
//           })
//           if (ok) return message.channel.send(`score update à ${user.gay - 1}`)
//           throw new Error("update failed")
//         } else {
//           return message.channel.send(`Joueur inexistant`)
//         }
//       }
//       case 'show':
//         if (user) {

//           message.channel.send(`${user.pseudo}: ${user.gay}`)
//         }
//         break;
//       case 'list': {
//         const users = await all('gayPasses', {
//           pseudo: 1
//         })
//         let res = "Listes des participants: \n"
//         users.forEach(user => res += `- ${user.pseudo}: ${user.gay}\n`)
//         return message.channel.send(res)
//       }
//       default:
//         return message.channel.send(`Commandes valides: add remove show list`)
//     }
//   }
// }
const delay = require('../modules/timer.js').delay

module.exports = {
  name: 'timer',
  description: 'Ajoute un timer',
  usage: '<start|stop> <nom> <minutes>',
  async execute(message, args) {
    message.channel.send(await timer(args))
  }
}

async function timer(args) {
  let msg = "Erreur..."
  const command = args.shift().toLowerCase();
  switch (command) {
    case 'add':
    case "start":
      const name = args[0] ? args[0] : timer.size
      let time = args.length > 2 ? parseFloat(args[2]) : 5
      time = typeof time === 'number' ? time : 5
      console.log('timer: :', name, time);
      msg = `Le timer ${name} est lancé pour ${time} minutes`
      delay(name, time).then((timerName) => {
        timer.delete(timerName)
        `BIP BIP BIP ${timerName} est fini`
      })
      break;
    case 'stop':
      if (args.length > 1 && timer.has(args[1])) {
        clearTimeout(timer.get(args[1]))
        msg = 'Le timer a été enlevé'
      } else {
        msg = `le timer n'exite pas`
      }
      break;
    default:
      msg = "Commande non valide..."
  }
  console.log('msg :', msg);
  return msg
}


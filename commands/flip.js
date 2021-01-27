const {random} = require('../modules/random.js');

module.exports = {
  name: 'flip',
  aliases: ['flipcoin'],
  description: 'Flip une pièce',
  usage: '',
  async execute(message, args) {
    try {
      const res = await random([1, 1000, 1]);
      if (res < 500) {
        message.channel.send('Pile')
      } else if (res > 500) {
        message.channel.send('Face')
      } else {
        message.channel.send('Coté')
      }
    } catch (e) {
      console.error('e :', e);
      message.channel.send(`Il y a eu une erreur..., on va dire que c'est pile`)
    }
  }
}
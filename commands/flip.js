const {random} = require('../modules/random.js');

module.exports = {
  name: 'flip',
  aliases: ['flipcoin'],
  description: 'Flip une pièce',
  usage: '',
  async execute(message, args) {
    try {
      const res = await random([0, 2, 1]);
      
      message.channel.send(res == 0 ? "Pile" : "Face", {split: true})
    } catch (e) {
      console.error('e :', e);
      message.channel.send(`Il y a eu une erreur..., on va dire que c'est pile`)
    }
  }
}
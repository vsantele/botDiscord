
require('dotenv').config();
const speak = require('../modules/audio/speak.js')

module.exports = {
  name: 'speak',
  description: 'TTS avec Voicerrs',
  async execute(message, args, options) {
    try {
      const {audio} = options
      const src = await speak(args.join(' '), 'fr-fr')
      const song = {
        title: "",
        src: src,
        type: "stream"
      };
      audio.execute(message, song)
    } catch (err) {
      throw err
    }
  }
}
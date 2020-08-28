
require('dotenv').config();
const speak = require('../modules/audio/speak.js')
const detectLang = require('../modules/detectLang.js')

module.exports = {
  name: 'speak',
  description: 'TTS avec Voicerrs',
  async execute(message, args, options) {
    try {
      const { audio } = options
      const text = args.join(' ')
      const src = await speak(text, detectLang(text))
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
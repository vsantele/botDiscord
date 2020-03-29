const voicerss = require("../voicerrs")
require('dotenv').config();
const bufferToReadable = require('../modules/bufferToReadable')

module.exports = {
  name: 'speak',
  description: 'TTS avec Voicerrs',
  execute(message, args, audio) {
    voicerss.speech({
      key: process.env.VOICERSS_KEY,
      hl: 'fr-fr',
      src: args.join(' '),
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      b64: false,
      callback: function (error, buffer) {
        if (error) {
          return console.error('error: ', error.toString())
        }
        const readable = bufferToReadable(buffer)
        const song = {
          title: "Speak!",
          src: readable,
          type: "stream"
        };
        audio.execute(message, song)
      }
    })
  }
}
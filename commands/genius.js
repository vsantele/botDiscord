const voicerss = require("../voicerrs")
const lyrics = require('../modules/genius.js').lyrics
const LanguageDetect = require('languagedetect');
const path = require('path');
const fs = require('fs');
const bufferToReadable = require('../modules/bufferToReadable')

const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')

require('dotenv').config();

module.exports = {
  name: 'genius',
  description: 'Fait dire les paroles d\'une chanson par le bot ou les affiches',
  args: true,
  usage: '<titre> [<artiste>]',
  async execute(message, args, audio) {
    const track = args.join(' ')
    const [text, title] = await lyrics(track)
    console.log('titre :', title);
    const lang = lngDetector.detect(text, 1)[0][0]
    message.channel.send(title)

    let hl
    switch (lang) {
      case 'en':
        hl = lang + '-us'
        break;
      case 'fr':
      case 'nl':
      case 'es':
      case 'it':
      case 'ru':
      case 'pt':
      case 'de':
        hl = lang + '-' + lang
        break;
      default:
        hl = 'fr-fr'

    }
    voicerss.speech({
      key: process.env.VOICERSS_KEY,
      hl: hl,
      src: text,
      r: 0,
      c: 'ogg',
      f: '16khz_16bit_mono',
      ssml: false,
      b64: false,
      callback: function (error, buffer) {
        if (error) {
          return console.error('error: ', error.toString())
        }
        const readable = bufferToReadable(buffer)
        const song = {
          title: title,
          src: readable,
          type: 'stream'
        };
        audio.execute(message, song)
      }
    })
  }
}
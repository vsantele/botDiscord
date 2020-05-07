const lyrics = require('../modules/genius.js').lyrics
const LanguageDetect = require('languagedetect');
const detectLang = require('../modules/detectLang.js')
const speak = require('../modules/audio/speak.js')

const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')

require('dotenv').config();

module.exports = {
  name: 'genius',
  description: 'Fait dire les paroles d\'une chanson par le bot ou les affiches',
  args: true,
  usage: '<titre> [<artiste>]',
  async execute(message, args, options) {
    const {audio} = options;
    const track = args.join(' ')
    const [text, title] = await lyrics(track)
    console.log('titre :', title);
    const lang = detectLang(text)
    message.channel.send(title)
    
    const song = {
      title: title,
      src: await speak(text, lang),
      type: "stream"
    };
    audio.execute(message, song)
  }
}
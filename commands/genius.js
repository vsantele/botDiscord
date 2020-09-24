const lyrics = require('../modules/genius.js').lyrics
const LanguageDetect = require('languagedetect');
const detectLang = require('../modules/detectLang.js')
const speak = require('../modules/audio/speak.js')

const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')

require('dotenv').config();

module.exports = {
  name: 'genius',
  description: `affiche les paroles et informations d'une chanson`,
  args: true,
  usage: '<titre> [<artiste>]',
  async execute(message, args, options) {
    const {audio} = options;
    const track = args.join(' ')
    const [text, title, infos] = await lyrics(track)
    console.log('titre :', title);
    // const lang = detectLang(text)
    const exampleEmbed = {
      color: 0x0099ff,
      title: infos.fullTitle,
      url: infos.url,
      author: {
        name: 'Genius',
        icon_url: 'https://i.imgur.com/wSTFkRM.png',
        url: 'https://genius.com',
      },
      description: `Informations et paroles pour: ${infos.fullTitle}`,
      thumbnail: {
        url: infos.artist.image,
      },
      fields: [{
          name: 'Artiste',
          value: infos.artist? `[${infos.artist.name}](${infos.artist.url})` : "inconnu",
          inline: true,
        },
        {
          name: 'Album',
          value: infos.album ? `[${infos.album.name}](${infos.album.url})` : "inconnu",
          inline: true,
        },
        {
          name: 'titre',
          value: `[${infos.title}](${infos.url}) \n ${infos.releasedAt ? new Date(infos.releasedAt).toLocaleString("fr-BE",{year:'numeric',month:'long',day:'numeric'}):"Date incoonu"}`,
          inline: true,
        },
      ],
      image: {
        url: infos.album && infos.album.cover_art_url,
      },
      timestamp: new Date(),
      footer: {
        text: 'C-3PO pour vous servir',
        icon_url: 'https://i.imgur.com/wSTFkRM.png',
      },
    };
    message.channel.send({
      embed: exampleEmbed,
      content: text,
      split: true,
    })
    
    // const song = {
    //   title: title,
    //   src: await speak(text, lang),
    //   type: "stream"
    // };
    // audio.execute(message, song)
  }
}
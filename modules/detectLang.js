const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function detectLang(text) {

  let lang = lngDetector.detect(text, 1)[0][0]

  switch (lang) {
    case 'en':
      lang = lang + '-us'
      break;
    case 'fr':
    case 'nl':
    case 'es':
    case 'it':
    case 'ru':
    case 'pt':
    case 'de':
      lang = lang + '-' + lang
      break;
    default:
      lang = 'fr-fr'

  }
  // return 'it-it'
  const langs = ["en-us", "fr-fr", "nl-nl", "es-es", "it-it", "ru-ru", "pt-pt", "de-de", "ar-eg", "bg-bg", "zh-cn", "hr - hr", "cs-cz", "da-dk", "fi-fi", "fr-ca", "el-gr", "he-il", "hi-in", "id-id", "hu-hu", "ja-jp", "nb-no", "pl-pl", "ro-ro", "sk-sk", "sv-se", "th-th","tr-tr"]
  return langs[getRandomInt(langs.length)]
  
  // return lang;
}

module.exports = detectLang
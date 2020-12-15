const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')


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
  return 'es-es'
  // return lang;
}

module.exports = detectLang
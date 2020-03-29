const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const {
  IamAuthenticator
} = require('ibm-watson/auth');

require('dotenv').config();

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_KEY
  }),
  url: process.env.IBM_URL
})

module.exports = {
  name: 'voice',
  description: 'TTS avec IMB',
  args: true,
  async execute(message, args, audio) {
    const params = {
      text: args.join (" "),
      voice: 'fr-FR_ReneeV3Voice', // Optional voice
      accept: 'audio/ogg;codecs=opus'
    };
    let content = await textToSpeech.synthesize(params)
    const song = {
      title: "Speak!",
      src: content,
      type: "stream"
    };
    audio.execute(message, song)
  }
}
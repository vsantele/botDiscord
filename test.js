var TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
var fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config({ silent: true });

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey:'bCK92qL9hYoAYKHLLL2C4iR3dJ5_YMrpYCc1Ai_18G4B'
  }),
  url:'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/d4659409-0a6e-4d7c-86e4-811fed134ea5'
})

const synthesizeParams = {
  text: 'Hello world',
  accept: 'audio/mp3',
  voice: 'en-US_AllisonVoice',
};

textToSpeech.synthesize(synthesizeParams)
  .then(audio => {
    audio.result.pipe(audio => fs.createWriteStream(audio,'hello_world.mp3'));
  })
  .catch(err => {
    console.log('error:', err);
  });
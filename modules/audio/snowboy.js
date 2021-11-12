// const fs = require('fs');
// const wav = require('wav');
// const path = require('path')
// const Detector = require('snowboy').Detector;
// const Models = require('snowboy').Models;

// const sox = require('sox-stream')

// const models = new Models();

// models.add({
//   file: path.join(__dirname,'resources/models/Gladys.pmdl'),
//   // file: path.join(__dirname, 'resources/models/snowboy.umdl'),
//   sensitivity: '0.7',
//   hotwords: 'snowboy'
// });

// const detector = new Detector({
//   // resource: path.join(__dirname,"resources/common.res"),
//   resource: 'node_modules/snowboy/resources/common.res',
//   models: models,
//   audioGain: 1.0,
//   applyFrontend: false
// });

// detector.on('silence', function () {
//   console.log('silence');
// });

// detector.on('sound', function (buffer) {
//   // <buffer> contains the last chunk of the audio that triggers the "sound"
//   // event. It could be written to a wav stream.
//   console.log('sound');
// });

// detector.on('error', function (erreur) {
//   console.error(erreur)
//   console.log('error');
// });

// detector.on('hotword', function (index, hotword, buffer) {
//   // <buffer> contains the last chunk of the audio that triggers the "hotword"
//   // event. It could be written to a wav stream. You will have to use it
//   // together with the <buffer> in the "sound" event if you want to get audio
//   // data after the hotword.
//   console.log('hotword', index, hotword);
// });

// // const file = fs.createReadStream('resources/test.wav');
// // const reader = new wav.Reader();

// // file.pipe(reader).pipe(detector);

// function rec(stream) {
//   console.log(detector.sampleRate())
//   console.log(detector.numChannels())
//   console.log(detector.bitsPerSample())
//   // command.input(stream).inputSampleRate(48000).inputEncoding('signed').inputBits(16).inputChannels(2).inputFileType('raw')
//   //   .outputSampleRate(16000).outputEncoding('signed').outputBits(16).outputChannels(1).inputFileType('raw')
//   //   .output(detector)
//   // command.run()
//   stream.pipe(sox({
//     input: {
//       type: 'raw',
//       rate: 48000,
//       encoding: 'signed',
//       channels: 2,
//       bits: 16
//     },
//     output: {
//       type: 'raw',
//       rate: 16000,
//       encoding: 'signed',
//       channels: 1,
//       bits: 16
//     }
//   })).pipe(detector)
//   // stream.pipe(resampler).pipe(detector)
// }

// module.exports = {
//   rec
// }

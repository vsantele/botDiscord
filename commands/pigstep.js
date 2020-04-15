const path = require('path');

module.exports = {
  name: 'pigstep',
  description: 'Cube de l\'été',
  execute(message, args, options) {
    const { audio } = options
    const song = {
      title: "Lena Raine - Pigstep",
      src: 'https://www.youtube.com/watch?v=HRYsz3uHsDg',
      type: "youtube"
    };
    audio.execute(message, song)
  }
}




const path = require('path');

module.exports = {
  name: 'imagine',
  description: 'Joue Image by msieudavid & Reremy',
  execute(message, args, options) {
    const { audio } = options
    const song = {
      title: "msieudavid & Reremy - Imagine",
      src: path.join(__dirname, "../songs/imagine.ogg"),
      type: "file"
    };
    audio.execute(message, song)
  }
}




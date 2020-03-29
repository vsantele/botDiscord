const path = require('path');

module.exports = {
  name: 'carla',
  description: 'Joue Bim Bam toi',
  execute(message, args, audio) {
    message.channel.send("et ça fait\nBIM BAM BOUM!")
    const song = {
      title: "Carla - Bim Bam toi",
      src: path.join(__dirname,"../songs/carla.ogg"),
      type: "file"
    };
    audio.execute(message, song)
  }
}




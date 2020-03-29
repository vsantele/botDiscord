module.exports = {
  name: 'skip',
  description: 'passage  à la chanson suivante',
  execute(message, args, audio) {
    audio.skip(message);
  }
}
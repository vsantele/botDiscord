module.exports = {
  name: 'volume',
  description: 'Modifie le volume entre 0 et 200%',
  execute(message, args, audio) {
    audio.volume(args)
  }
}
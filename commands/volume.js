module.exports = {
  name: "volume",
  description: "Modifie le volume entre 0 et 200%",
  execute(message, args, options) {
    const { audio } = options
    audio.volume(args)
  },
}

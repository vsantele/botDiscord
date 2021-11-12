module.exports = {
  name: "skip",
  description: "passage  à la chanson suivante",
  execute(message, args, options) {
    const { audio } = options
    audio.skip(message)
  },
}

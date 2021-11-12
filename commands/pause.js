module.exports = {
  name: "pause",
  description: "Met en pause le titre en cours",
  execute(message, args, options) {
    const { audio } = options
    audio.pause()
  },
}

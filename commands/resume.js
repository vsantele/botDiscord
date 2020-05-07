module.exports = {
  name: 'resume',
  description: 'redémarre la chanson en cours',
  execute(message, args, options) {
    const {
      audio
    } = options
    audio.resume()
  }
}
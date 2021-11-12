module.exports = {
  name: "remove",
  description: `retire une musique de la file d'attendre`,
  args: true,
  usage: "<numéro>",
  execute(message, args, options) {
    const { audio } = options
    const num = args[0]
    if (Number.isInteger(parseInt(num, 10)) && num > 0 && num < audio.length) {
      audio.remove(num)
    } else {
      throw new Error(
        `Argument invalide! Tu ne peux pas supprimer la première chanson ou une chason qui n'existe pas`
      )
    }
  },
}

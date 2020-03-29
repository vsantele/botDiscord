
module.exports = {
  name: 'reload',
  description: 'Recharge une commande',
  users: ["94876363479056384"],
  args: true,
  execute(message, args) {
    const commandName = args[0].toLowerCase()
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return message.channel.send(`Il n'y a pas de commande portant ce nom...`)

    delete require.cache[require.resolve(`./${commandName}.js`)]

    try {
      const newCommand = require(`./${commandName}.js`)
      message.client.commands.set(newCommand.name, newCommand)
      message.channel.send(`La commande \`${commandName}\` a été rechargée`);
    } catch (error) {
      message.channel.send(`Une erreur a eu lieu lors de rechargement de la commande \`${commandName}\`:\n\`${error.message}\``)
    }
  }
}
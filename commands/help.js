const {prefix} = require('../config.json')

module.exports = {
  name: 'help',
  description: 'Liste de toutes les commandes ou les infos pour une commande spécifique',
  aliases: ['commandes'],
  usage: '[command name]',
  cooldown: 5,
  execute(message, args) {
    const data = []
    const { commands } = message.client
    
    if (!args.length) {
      data.push('Voici la liste de toutes mes commandes:')
      data.push(commands.map(command => command.name).join('\n'))
      data.push(`\n Vous pouvez envoyer \`${prefix}help ${this.usage}\` pour avoir des infos sur une commande spécifique`)

      return message.channel.send(data, { split: true })
    }

    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply('Ce n\'est pas  une commande valide')
    }

    data.push(`**Nom:** ${command.name}`)

    if (command.aliases) data.push(`**Alias** ${command.aliases.join(', ')}`)
    if (command.description) data.push(`**Description:** ${command.description}`)
    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`)
    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, {split: true})
  }
}
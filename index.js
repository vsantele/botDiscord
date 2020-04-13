const fs = require("fs")
const Discord = require('discord.js');
const { prefix } = require('./config.json')
const AudioController = require('./modules/audio/AudioController.js')
const events = require('events')

const path = require("path")

const audioEvents = new events.EventEmitter()

const client = new Discord.Client();
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith('.js'))

for(const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

require('dotenv').config();

const token = process.env.TOKEN_DISCORD;

const audios = new Discord.Collection()

const cooldowns = new Discord.Collection()

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
//   const channel = client.channels.get('471729962060087297')
//   const channel = client.guilds.channels.find(chan => chan.name === 'général')
//   channel.send('Hello World')
client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()

  
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  if (command.args && !args.length) {
    let reply = `Il faut des arguments pour utiliser cette fonction, ${message.author}!`
    if (command.usage) {
      reply += `\n Utilisation: \`${prefix}${command.name} ${command.usage}\``
    }
    return message.channel.send(reply)
  }

  if (command.users && !command.users.includes(message.author.id)) {
    return message.reply(`Tu n'as pas le droit d'utiliser la commande \`${command.name}\`!`)
  }

  if (!audios.has(message.guild.id)) {
    audios.set(message.guild.id, new AudioController(message, audioEvents))
  }
  const audioQueue = audios.get(message.guild.id)

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) { 
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`Tu dois attendre encore ${timeLeft.toFixed(1)} secondes avant de réutiliser la commande \`${command.name}\``)
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  try {
    command.execute(message, args, {audio: audioQueue})
  } catch (err) {
    console.error(err)
    message.reply('Il y a eu une erreur...')
  }
});

function deleteAudioController(guildId) {
  if (audios.has(guildId)) {
    console.log(`${guildId} a été suprimmé`)
    audios.delete(guildId)
  }
}

audioEvents.on('delete', deleteAudioController)

client.login(token);
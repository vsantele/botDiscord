const darksky = require('../modules/weather.js').darksky

module.exports = {
  name: "météo",
  aliases: ['meteo', 'weather'],
  description: 'Donne la météo à Mouscron',
  cooldown: 60,
  async execute(message, args) {
    try {
      const previsions = await darksky()
      const res = `Il fait actuellement ${previsions.currently.temperature}°C avec un temps ${previsions.currently.summary}. \n Le temps sera ${previsions.nextHour.summary} \n Et demain il y aura un maximum de ${previsions.nextDay.temperatureHigh}°C et un minimum de ${previsions.nextDay.temperatureLow}°C avec un temps ${previsions.nextDay.summary} \n À bientôt pour d'autres prévisions! (svp abusez pas j'ai 1000 résultats par jours <3`
      message.channel.send(res)
    } catch (error) {
      console.error(error)
      message.channel.send(`Il y a eu une erreur avec la commande ${this.name}`)
    }
  }
}
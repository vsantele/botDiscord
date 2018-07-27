const Discord = require('discord.js');
const request = require('request');
const client = new Discord.Client();

require('dotenv').load();
const token = process.env.TOKEN_DISCORD;
var darksky = function(callback){
	var  url = 'https://api.darksky.net/forecast/1db40f2d4215858a66ed5ae0d02a2bc6/50.7459924,3.2171203?lang=fr&units=si&exclude=flags,hourly';

	request(url, function(err, response, body){
		try{
			var result = JSON.parse(body);
			var previsions = {
				currently : {
                    summary: result.currently.summary,
                    icon: result.currently.icon,
                    temperature: result.currently.temperature
                },
                nextHour: {
                    summary: result.minutely.summary,
                    icon : result.minutely.icon
                },
                nextDay: {
                    summary: result.daily.data[1].summary,
                    icon: result.daily.data[1].icon,
                    temperatureHigh: result.daily.data[1].temperatureHigh,
                    temperatureLow: result.daily.data[1].temperatureLow
                }
			};

			callback(null, previsions);
		}catch(e){
			callback(e); 
		}
	});
}

var chien = function(callback) {
    var url = 'https://api.thedogapi.co.uk/v2/dog.php'

    request(url, function(err, response, body){
        try{
            var result = JSON.parse(body);
            var image = result.data[0].url;
            callback(null, image);
        }catch(e){
            callback(e);
        }
    })
}

var chuck = function(callback) {
    var url= 'https://api.chucknorris.io/jokes/random'

    request(url, function(err, response, body){
        try {
            var result = JSON.parse(body);
            var fact = result.value;
            callback(null, fact);
        }catch(e){
            callback(e);
        }
    })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
    if (msg.content === 'pong') {
        msg.reply('ping');
    }
    if (msg.content === 'meteo' || msg.content === 'météo' || msg.content === 'wheater') {
        darksky(function(err, previsions){
            if(err) return msg.reply(err);
        
            msg.reply(`Il fait actuellement ${previsions.currently.temperature}°C avec un temps ${previsions.currently.summary}. \n Le temps sera ${previsions.nextHour.summary} \n Et demain il y aura un maximum de ${previsions.nextDay.temperatureHigh}°C et un minimum de ${previsions.nextDay.temperatureLow}°C avec un temps ${previsions.nextDay.summary} \n À bientôt pour d'autres prévisions! (svp abusez pas j'ai 1000 résultats par jours <3 `);
        });
    }
    if (msg.content === 'chien') {
        chien(function(err,image){
            if(err) return msg.reply(err);

            msg.reply("Voici un chien rien que pour vous 💕", { file: image})
        })
    }
    if (msg.content === 'chat') {
        msg.reply('Voici un chat rien que pour vous 😻 \n https://lorempixel.com/640/480/cats')
    }
    if(msg.content === 'chuck') {
        chuck(function(err,fact){
            if(err) return msg.reply(err);
            msg.reply(`${fact}`)
        })
    }
    
  });
  
  client.login(token);


const Discord = require('discord.js');
const request = require('request');
const fs = require("fs")
const path = require("path")
const say = require('say')
const randToken = require('rand-token')
require('./latinise')
const client = new Discord.Client();
require('dotenv').config();
const token = process.env.TOKEN_DISCORD;
var dispatcher;
var voiceChan;
let isReady = false
const voice = say.getInstalledVoices(voices => {if(typeof voices == "array") voices[0]; else voices} )

const songsPath = path.join(__dirname, "songs")
var darksky = function(callback){
	var  url = `https://api.darksky.net/forecast/${process.env.DARKSKY_TOKEN}/50.7459924,3.2171203?lang=fr&units=si&exclude=flags,hourly`;

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

var quote = async function(callback) {
    wikiquote.searchPeople('steve jobs')
        .then(page => {wikiquote.getRandomQuote(page[0].title); console.log(page[0])})
        .then(quote => {
            console.log(quote)
            callback(null, quote)
        })
        .catch(e => {
            if (e) {
                console.error(e);
                callback(e)
            }
        })

}

const diffSub = async callback => {
    const url = 'https://www.googleapis.com/youtube/v3/channels?id=UC-lHJZR3Gqxm24_Vd_AJ5Yw,UCq-Fj5jknLsUf-MWSy4_brA&part=statistics&key='+process.env.YOUTUBE_TOKEN
    request(url, (err, res, body) => {
        if(err) return console.error(err)
        try {
            console.log('body :', body);
            var result = JSON.parse(body)
            let arrSub = result.items.map(chan => {return {sub: chan.statistics.subscriberCount, id: chan.id, view: chan.statistics.viewCount}}) // 0: Pew 1: Tse
            let diff = arrSub[0].sub - arrSub[1].sub
            let diffV = arrSub[0].view - arrSub[1].view
            if (arrSub[0].id !== 'UC-lHJZR3Gqxm24_Vd_AJ5Yw') {diff = 0 - diff; diffV = 0 - diffV}
            callback(null, `PewDiePie a ${diff} abonnés de plus que T-Series! et il y a une différence de ${diffV} vues`)
        } catch(e) {
            callback(e)
        }
    })
}

client.on('ready', () => {
    isReady = true
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('message', msg => {
    if(msg.author.bot) return;
    if (msg.content.toLowerCase() === 'ping') {
      msg.reply('pong');
    }
     else if (msg.content.toLowerCase() === 'pong') {
        msg.reply('ping');
    }
     else if (msg.content.toLowerCase() === 'meteo' || msg.content.toLowerCase() === 'météo' || msg.content.toLowerCase() === 'wheater') {
        darksky(function(err, previsions){
            if(err) return msg.reply(err);
        
            msg.channel.send(`Il fait actuellement ${previsions.currently.temperature}°C avec un temps ${previsions.currently.summary}. \n Le temps sera ${previsions.nextHour.summary} \n Et demain il y aura un maximum de ${previsions.nextDay.temperatureHigh}°C et un minimum de ${previsions.nextDay.temperatureLow}°C avec un temps ${previsions.nextDay.summary} \n À bientôt pour d'autres prévisions! (svp abusez pas j'ai 1000 résultats par jours <3 `);
        });
    }
    else if (msg.content.toLowerCase() === 'chien') {
        chien(function(err,image){
            if(err) return msg.reply(err);

            msg.reply("Voici un chien rien que pour vous 💕", { file: image})
        })
    }
    else if (msg.content.toLowerCase() === 'chat') {
        msg.reply('Voici un chat rien que pour vous 😻 \n https://lorempixel.com/640/480/cats')
    }
    else if(msg.content.toLowerCase() === 'chuck') {
        chuck(function(err,fact){
            if(err) return msg.reply(err);
            msg.channel.send(`${fact}`)
        })
    }
    else if(msg.content.toLowerCase() === "et ça fait") {
        voiceChan = msg.member.voiceChannel
        msg.channel.send("BIM BAM BOUM!")
        if(isReady) {
            voiceChan.join().then(con => {
                isReady = false
                dispatcher = con.playFile(path.join(songsPath,'Carla - Bim Bam toi (Clip Officiel).mp3'))
                dispatcher.setVolume(0.2)
                dispatcher.on("end", end => {
                    console.log('end :', end);
                    voiceChan.leave()
                    fs.unlink(path.join(songsPath,token), console.error)
                    isReady = true
                })
            }).catch(console.error)
        }
    }
    else if (msg.author.username === "WolfVic" && msg.content.toLowerCase() === "debug") {
        msg.channel.send("debug: ")
    }
    else if (isReady && msg.content.toLowerCase().startsWith("play")) {
        isReady = false;
        const arg = msg.content.slice(4);
        const token = randToken.generate(5) + '.wav'
        console.log('arg :', arg);
        voiceChan = msg.member.voiceChannel
        if(!voiceChan) {
            return msg.reply(" TU DOIS ETRE EN VOCAL CONNARD!")
        }
        if (arg.length > 2) {

            say.export(arg,voice,1.0,path.join(songsPath,token), (err) => {
                if (err) {
                    msg.channel.send("Erreur export...")
                    return msg.channel.send(err)
                }
                voiceChan.join().then(con => {
                    dispatcher = con.playFile(path.join(songsPath,token))
                    dispatcher.setVolume(0.2)
                    dispatcher.on("end", end => {
                        voiceChan.leave()
                        fs.unlink(path.join(songsPath,token), console.error)
                        isReady = true
                    })
                }).catch((err) => {
                    if (err) console.error(err)
                    fs.unlink(path.join(songsPath,token), console.error)
                    isReady = true
                })
            })
        }
        
    } else if(msg.content.toLowerCase().startsWith("stop")) {
        msg.member.voiceChannel.leave()
    }
    
  });
  
  client.login(token);


const Discord = require('discord.js');
const request = require('request');
const client = new Discord.Client();
const wikiquote = require('wikiquote')
const ytdl = require('ytdl-core');
const prefix = "!"

const queue = new Map();

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
    const url = 'https://www.googleapis.com/youtube/v3/channels?id=UC-lHJZR3Gqxm24_Vd_AJ5Yw,UCq-Fj5jknLsUf-MWSy4_brA&part=statistics&key=AIzaSyDFR4RRS18rJRqr1Jhjo7QikW6UarhT85M'
    request(url, (err, res, body) => {
        try {
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
    console.log(`Logged in as ${client.user.tag}!`);
  });
//   const channel = client.channels.get('471729962060087297')
//   const channel = client.guilds.channels.find(chan => chan.name === 'général')
//   channel.send('Hello World')
  client.on('message', msg => {
    const message = msg;
    if (message.author.bot) return;
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
    if (msg.content === 'quote') {
        quote(function(err, quote) {
            if (err) return msg.reply(err);
            msg.reply(`${quote}`)
        })
    }
    if (msg.content === 'pewds') {
        // console.dir(JSON.stringify(msg))
        diffSub((err, diff) => {
            if (err) return msg.reply(err);
            msg.reply(`${diff}`)
        })

    }

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
       } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
       } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
       } else {
       message.channel.send('You need to enter a valid command!')
       }
    
  });

  async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}

	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
  
  client.login(token);


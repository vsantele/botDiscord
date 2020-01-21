const Discord = require('discord.js');
const request = require('request');
const fs = require("fs")
const path = require("path")
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const {
    IamAuthenticator
} = require('ibm-watson/auth');
const genius = require('genius-lyrics')
const voicerss = require("./voicerrs")
const client = new Discord.Client();
const wikiquote = require('wikiquote')
const ytdl = require('ytdl-core');
const RandomOrg = require('random-org')
const cheerio = require('cheerio')
const LanguageDetect = require('languagedetect');
const prefix = "!"

const queue = new Map();
let volume = 1;

const timer = new Map()

require('dotenv').config();
const Genius = new genius.Client(process.env.GENIUS_TOKEN)
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')
const random = new RandomOrg({apiKey: process.env.RANDOM_TOKEN})
const token = process.env.TOKEN_DISCORD;
var dispatcher;
var voiceChan;
let isReady = false



const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_KEY
    }),
    url: process.env.IBM_URL
})

const songsPath = path.join(__dirname, "songs")
var darksky = function (callback) {
    var url = `https://api.darksky.net/forecast/${process.env.DARKSKY_TOKEN}/50.7459924,3.2171203?lang=fr&units=si&exclude=flags,hourly`;

    request(url, function (err, response, body) {
        try {
            var result = JSON.parse(body);
            var previsions = {
                currently: {
                    summary: result.currently.summary,
                    icon: result.currently.icon,
                    temperature: result.currently.temperature
                },
                nextHour: {
                    summary: result.minutely.summary,
                    icon: result.minutely.icon
                },
                nextDay: {
                    summary: result.daily.data[1].summary,
                    icon: result.daily.data[1].icon,
                    temperatureHigh: result.daily.data[1].temperatureHigh,
                    temperatureLow: result.daily.data[1].temperatureLow
                }
            };

            callback(null, previsions);
        } catch (e) {
            callback(e);
        }
    });
}

var chien = function (callback) {
    var url = 'https://api.thedogapi.co.uk/v2/dog.php'

    request(url, function (err, response, body) {
        try {
            var result = JSON.parse(body);
            var image = result.data[0].url;
            callback(null, image);
        } catch (e) {
            callback(e);
        }
    })
}

var chuck = function (callback) {
    var url = 'https://api.chucknorris.io/jokes/random'

    request(url, function (err, response, body) {
        try {
            var result = JSON.parse(body);
            var fact = result.value;
            callback(null, fact);
        } catch (e) {
            callback(e);
        }
    })
}

var quote = async function (callback) {
    wikiquote.searchPeople('steve jobs')
        .then(page => {
            wikiquote.getRandomQuote(page[0].title);
            console.log(page[0])
        })
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
    const url = 'https://www.googleapis.com/youtube/v3/channels?id=UC-lHJZR3Gqxm24_Vd_AJ5Yw,UCq-Fj5jknLsUf-MWSy4_brA&part=statistics&key=' + process.env.YOUTUBE_TOKEN
    request(url, (err, res, body) => {
        if (err) return console.error(err)
        try {
            console.log('body :', body);
            var result = JSON.parse(body)
            let arrSub = result.items.map(chan => {
                return {
                    sub: chan.statistics.subscriberCount,
                    id: chan.id,
                    view: chan.statistics.viewCount
                }
            }) // 0: Pew 1: Tse
            let diff = arrSub[0].sub - arrSub[1].sub
            let diffV = arrSub[0].view - arrSub[1].view
            if (arrSub[0].id !== 'UC-lHJZR3Gqxm24_Vd_AJ5Yw') {
                diff = 0 - diff;
                diffV = 0 - diffV
            }
            callback(null, `PewDiePie a ${diff} abonnés de plus que T-Series! et il y a une différence de ${diffV} vues`)
        } catch (e) {
            callback(e)
        }
    })
}

const lyrics = async (track) => {
    let res = []
    if (track.length > 2) {
        try {
            console.log('track :', track);
            const search = await Genius.findTrack(track)
            const info = await Genius.getAll(search)
            const lyrics = info.lyrics.split('\n').filter(line => !line.startsWith('[')).join('\n')
            res[0] = lyrics
            res[1] = info.full_title
            return res
        } catch (error) {
            console.log('error :', error);
        }
    }
}
async function delay(name, delayInMin) {
    return new Promise(resolve  => {
      timer.set(name,setTimeout(() => {
        resolve(name);
      }, delayInMin * 60000));
    });
  }

function generateOutputFile(channel, member) {
    // use IDs instead of username cause some people have stupid emojis in their name
    const fileName = `./recordings/${channel.id}-${member.username}-${Date.now()}.pcm`;
    return fs.createWriteStream(fileName);
}

const {
    Readable
} = require('stream');
class Silence extends Readable {
    _read() {
        this.push(Buffer.from([0xF8, 0xFF, 0xFE]));
    }
}

function getWord(word) {
    return new Promise((resolve, reject) => {
      request.get(`https://www.larousse.fr/dictionnaires/francais/${word}`, function (
        error,
        response,
        data
      ) {
        if (error) {
          reject(error)
        } else {
          const $ = cheerio.load(data);
          if($('section.corrector > p').is('.err')) {
            reject('Error, mot inconnu')
          } else if ($('section').is('section.corrector')) {
            console.log($('.corrector > ul').children().first().text())
            resolve(getWord($('.corrector > ul').children().first().text()))
          }else {
            let definitions = []
            $('.Definitions').children().each(function (i, elem) {
              definitions.push($(this).text())
            })
            let locutions = []
            $('.ListeLocutions').children().each(function (i, elem) {
              locutions.push($(this).text())
            })
            resolve({
              word,
              definitions,
              locutions
            });
          }
        }
      });
    })
  }

client.on('ready', () => {
    isReady = true
    console.log(`Logged in as ${client.user.tag}!`);
});
//   const channel = client.channels.get('471729962060087297')
//   const channel = client.guilds.channels.find(chan => chan.name === 'général')
//   channel.send('Hello World')
client.on('message', async msg => {
    if (msg.author.bot) return;
    let serverQueue
    if (msg.guild) serverQueue = queue.get(msg.guild.id);
    if (msg.content.toLowerCase() === 'ping') {
        msg.reply('pong');
    } else if (msg.content.toLowerCase() === 'pong') {
        msg.reply('ping');
    } else if (msg.content.toLowerCase() === 'meteo' || msg.content.toLowerCase() === 'météo' || msg.content.toLowerCase() === 'wheater') {
        darksky(function (err, previsions) {
            if (err) return msg.reply(err);

            msg.channel.send(`Il fait actuellement ${previsions.currently.temperature}°C avec un temps ${previsions.currently.summary}. \n Le temps sera ${previsions.nextHour.summary} \n Et demain il y aura un maximum de ${previsions.nextDay.temperatureHigh}°C et un minimum de ${previsions.nextDay.temperatureLow}°C avec un temps ${previsions.nextDay.summary} \n À bientôt pour d'autres prévisions! (svp abusez pas j'ai 1000 résultats par jours <3 `);
        });
    } else if (msg.content.toLowerCase() === 'chien') {
        chien(function (err, image) {
            if (err) return msg.reply(err);

            msg.reply("Voici un chien rien que pour vous 💕", {
                file: image
            })
        })
    } else if (msg.content.toLowerCase() === 'chat') {
        msg.reply('Voici un chat rien que pour vous 😻 \n https://lorempixel.com/1280/720/cats')
    } else if (msg.content.toLowerCase() === 'chuck') {
        chuck(function (err, fact) {
            if (err) return msg.reply(err);
            msg.channel.send(`${fact}`)
        })
    }
    if (msg.content === 'quote') {
        quote(function (err, quote) {
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

    if (isReady && msg.content.startsWith(`${prefix}play`)) {
        execute(msg, serverQueue);
        return;
    } else if (isReady && msg.content.startsWith(`${prefix}skip`)) {
        skip(msg, serverQueue);
        return;
    } else if (isReady && msg.content.startsWith(`${prefix}stop`)) {
        stop(msg, serverQueue);
        return;
    } else if (msg.content.startsWith(`${prefix}volume`)) {
        const args = msg.content.split(' ');
        volume = args[1] / 100
        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume)

    } else if (msg.content.toLowerCase() === "et ça fait") {
        msg.channel.send("BIM BAM BOUM!")
        voiceChan = msg.member.voiceChannel
        if (voiceChan && isReady) {
            voiceChan.join().then(con => {
                isReady = false
                dispatcher = con.playFile(path.join(songsPath, 'Carla - Bim Bam toi (Clip Officiel).mp3'))
                dispatcher.setVolumeLogarithmic(0.5)
                dispatcher.on("end", end => {
                    console.log('end :', end);
                    voiceChan.leave()
                    // fs.unlink(path.join(songsPath,token), console.error)
                    isReady = true
                })
            }).catch(console.error)
        }
    } else if (msg.author.username === "WolfVic" && msg.content.toLowerCase() === "debug") {
        msg.channel.send("debug: ")
    } else if (isReady && msg.content.toLowerCase().startsWith("voice")) {
        voiceChan = msg.member.voiceChannel
        const arg = msg.content.slice(6);
        if (!voiceChan) {
            return msg.reply(" TU DOIS ETRE EN VOCAL CONNARD!")
        }
        console.log('arg :', arg);

        if (arg.length > 2) {
            isReady = false;
            const params = {
                text: arg,
                voice: 'fr-FR_ReneeV3Voice', // Optional voice
                accept: 'audio/ogg;codecs=opus'
            };
            let audio = await textToSpeech.synthesize(params)
            voiceChan.join().then(async con => {
                dispatcher = con.playStream(audio.result)
                // dispatcher = con.playStream(audio.result);
                dispatcher.setVolumeLogarithmic(1)
                dispatcher.on("end", end => {
                    voiceChan.leave()
                    // fs.unlink(path.join(songsPath,tokenSong), console.error)
                    isReady = true
                })
            })
        }
    } else if (msg.content.toLowerCase().startsWith("stop")) {
        msg.member.voiceChannel.leave()
        // fs.unlink(path.join(songsPath,tokenSong), console.error)
        isReady = true
    } else if (msg.content.toLocaleLowerCase().startsWith("play")) {
        const arg = msg.content.slice(4)
        console.log(msg.content)
        voiceChan = msg.member.voiceChannel
        if (isReady && voiceChan) {
            voicerss.speech({
                key: process.env.VOICERSS_KEY,
                hl: 'fr-fr',
                src: arg,
                r: 0,
                c: 'mp3',
                f: '44khz_16bit_stereo',
                ssml: false,
                b64: false,
                callback: function (error, audio) {
                    if (error) {
                        return console.error('error: ', error.toString())
                    }
                    isReady = false
                    // console.log('content: ', audio.toString())
                    fs.writeFileSync('./songs/test.mp3', Buffer.from(audio))
                    voiceChan.join().then(async con => {
                        dispatcher = con.playFile('./songs/test.mp3')
                        dispatcher.setVolumeLogarithmic(1)
                        dispatcher.on("end", end => {
                            voiceChan.leave()
                            isReady = true
                        })
                    })
                }
            })
        }
    } else if (msg.content.toLowerCase().startsWith('timer')) {
        const args = msg.content.split(' ')
        if(args.length > 2) {
            switch(args[1]) {
                case "add":
                    const name = args.length > 3 ? args[3] : timer.size
                    let time = args.length > 2 ?  parseFloat(args[2]) : 5
                    time = typeof time === 'number' ? time : 5
                    console.log('timer: :', name, time);
                    msg.channel.send(`Le timer ${name} est lancé pour ${time} minutes`)
                    delay(name, time).then((timerName) => {
                        msg.channel.send(`BIP BIP BIP ${timerName} est fini`)
                        if (isReady && msg.member.voiceChannel) {
                            isReady = false
                            msg.member.voiceChannel.join().then(async con => {
                                dispatcher = con.playFile('./songs/bip.mp3')
                                dispatcher.on("end", end => {
                                    voiceChan.leave()
                                    isReady = true
                                })
                            })
                        }
                        timer.delete(timerName)
                    })
                    break;
                case 'stop':
                    if(args.length > 2 && timer.has(args[2])) {
                        clearTimeout(timer.get(args[2]))
                        msg.channel.send('Le timer a été enlever')
                    } else {
                        msg.channel.send(`le timer n'exite pas`)
                    }
                    break;
                default:
                    msg.channel.send("Commande non valide...")
            }
            
        }
    } else if (msg.content.startsWith('rec')) {
        const voiceChannel = msg.member.voiceChannel
        //console.log(voiceChannel.id);
        if (!voiceChannel || voiceChannel.type !== 'voice') {
            return msg.reply(`I couldn't find the channel ${channelName}. Can you spell?`);
        }
        voiceChannel.join()
            .then(conn => {
                let dispatcher;
                msg.reply('ready!');
                // create our voice receiver
                const receiver = conn.createReceiver();
                conn.on('ready', () => {
                    dispatcher = conn.play(new Silence(), {
                        type: 'opus'
                    });
                })
                conn.on('speaking', (user, speaking) => {
                    if (speaking) {
                        //   console.log(user)
                        if (user.username === 'WolfVic') {
                            const outputStream = generateOutputFile(voiceChannel, user);
                            const audioStream = receiver.createPCMStream(user);
                            dispatcher.end()
                            dispatcher = conn.playStream(audioStream);
                            audioStream.pipe(outputStream)
                            // when the stream ends (the user stopped talking) tell the user
                            audioStream.on('end', () => {
                                msg.channel.send(`I'm no longer listening to ${user}`);
                                voiceChannel.leave()
                            });

                        }
                        // msg.channel.send(`I'm listening to ${user}`);
                        // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                        // create an output stream so we can dump our data in a file
                        // pipe our audio data into the file stream
                    }
                });
            })
            .catch(console.log);
    } else if (msg.content.toLowerCase().startsWith('genius')) {
        voiceChan = msg.member.voiceChannel
        if (isReady && voiceChan) {
            const track = msg.content.slice('genius'.length)
            if (track.length > 2) {
                const [text,title] = await lyrics(track)
                // const text = await lyrics(track)
                console.log('titre :', title);
                const lang = lngDetector.detect(text, 1)[0][0]
                msg.channel.send(title)
                // console.log('lang :', lang);
                let hl
                switch (lang) {
                    case 'en':
                        hl = lang + '-us'
                        break;
                    case 'fr':
                    case 'nl':
                    case 'es':
                    case 'it':
                    case 'ru':
                    case 'pt':
                    case 'de':
                        hl = lang + '-' + lang
                        break;
                    default:
                        hl = 'fr-fr'

                }
                voicerss.speech({
                    key: process.env.VOICERSS_KEY,
                    hl: hl,
                    src: text,
                    r: 0,
                    c: 'mp3',
                    f: '44khz_16bit_stereo',
                    ssml: false,
                    b64: false,
                    callback: function (error, audio) {
                        if (error) {
                            return console.error('error: ', error.toString())
                        }
                        isReady = false
                        // console.log('content: ', audio.toString())
                        fs.writeFileSync('./songs/lyrics.mp3', Buffer.from(audio))
                        voiceChan.join().then(async con => {
                            dispatcher = con.playFile('./songs/lyrics.mp3')
                            dispatcher.setVolumeLogarithmic(1)
                            dispatcher.on("end", end => {
                                voiceChan.leave()
                                isReady = true
                            })
                        })
                    }
                })
            }
        }
    } else if(msg.content.toLowerCase().startsWith('random')) {
        const args = msg.content.split(' ');
        const nbs = await random.generateIntegers({min: args[1] ? args[1] : 0, max: args[2] ? args[2] : 10, n: args[3] ? args[3] : 1});
        // console.log('nbs :', nbs);
        msg.channel.send(nbs.random.data.join(' '))
    } else if (msg.content.toLowerCase().startsWith('definition') || msg.content.toLowerCase().startsWith('définition') || msg.content.toLowerCase().startsWith('def')) {
        const args = msg.content.split(' ');
        try {
            let defs = await getWord(args[1])
            let res = `${defs.word}: \n  Définition${defs.definitions.length > 1 ? 's' : ''}:\n`
            defs.definitions.forEach((def) => {res +='  - ' + def + '\n'})
            if (defs.locutions.length > 1) {
                res += `  Locution${defs.locutions.length > 1 ? 's' : ''}:\n`
                defs.locutions.forEach((loc) => {res += '  - ' +loc + '\n'})
            }
            msg.channel.send(res)
        } catch (e) {
            console.error('e :', e);
            msg.channel.send(e)
        }
    } else if (msg.content.toLowerCase() === 'help') {
        let help = 'Liste des commandes: \n'
        help += 'chat: envoie une photo de chat\n'
        help += 'chuck: envoie un fact sur chuck norris\n'
        help += 'play: joue le message dans le channel vocal\n'
        help += 'stop: fait quitter le bot du channel vocal\n'
        help += '!play: joue une musique depuis un lien youtube\n'
        help += '!skip: passe à la chason suivante de la playlist\n'
        help += '!stop: supprime la playlist en cours et fait quitter le bot du channel vocal\n'
        help += '!volume [0-200]: change le volume\n'
        help += 'et ça fait: BIM BAM BOOM\n'
        help += 'random [min] [max] [nb]: tire [nb] nombres entiers compris entre [min] et [max] par défaut 1 nombre entre 1 et 10\n'
        help += 'timer add [min] [nom] créé un timer de [min] minutes avec [nom] en nom\n'
        help += 'timer stop [nom] stop le timer [nom]\n'
        msg.channel.send(help)
    }

});

async function execute(msg, serverQueue) {
    const args = msg.content.split(' ');

    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return msg.channel.send('I need the permissions to join and speak in your voice channel!');
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(msg.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            // console.log("queue:",queueContruct.songs[0])
            var connection = await voiceChannel.join();
            // console.log('connection :', connection);
            queueContruct.connection = connection;
            play(msg.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(msg.guild.id);
            return msg.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return msg.channel.send(`${song.title} has been added to the queue!`);
    }

}

function skip(msg, serverQueue) {
    if (!msg.member.voiceChannel) return msg.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return msg.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
}

function stop(msg, serverQueue) {
    if (!msg.member.voiceChannel) return msg.channel.send('You have to be in a voice channel to stop the music!');
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
    console.log(song)
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Music ended!');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(volume);
}

client.login(token);
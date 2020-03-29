const fs = require("fs")
const Discord = require('discord.js');
const {prefix} = require('./config.json')

const path = require("path")
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const {
  IamAuthenticator
} = require('ibm-watson/auth');

const voicerss = require("./voicerrs")

const client = new Discord.Client();

const ytdl = require('ytdl-core');
const RandomOrg = require('random-org')

const LanguageDetect = require('languagedetect');
var exec = require('child_process').exec;

const weather = require('./modules/weather.js').weather
const chien = require('./modules/animals.js').chien
const chuck = require('./modules/quotes.js').chuck
const quote = require('./modules/quotes.js').quote
const diffSub = require('./modules/stats.js').diffSub
const lyrics = require('./modules/genius.js').lyrics
const timer = require('./modules/timer.js').timer
const Message = require('./modules/send.js').Message
const Guilds = require('./modules/guilds.js').Guilds
const dict = require('./modules/dict.js').dict

const guilds = new Guilds()

const queue = new Map();
let volume = 1;

require('dotenv').config();

const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2')
const random = new RandomOrg({
  apiKey: process.env.RANDOM_TOKEN
})
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



client.once('ready', () => {
  isReady = true
  console.log(`Logged in as ${client.user.tag}!`);
});
//   const channel = client.channels.get('471729962060087297')
//   const channel = client.guilds.channels.find(chan => chan.name === 'général')
//   channel.send('Hello World')
client.on('message', async msg => {
  let serverQueue, control
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()
  if (msg.guild) {
    serverQueue = queue.get(msg.guild.id);
    control = guilds.get(msg.guild.id)
    control.chan = msg.channel
  }
  console.log('args :', args);
  if (command === 'ping') {
    msg.reply('pong');
  } else if (command === 'pong') {
    msg.reply('ping');
  } else if (command === 'meteo' || command === 'météo' || msg.command === 'wheater') {
    const res = await weather()
    msg.channel.send(res)
  } else if (command === 'chien') {
    chien(function (err, image) {
      if (err) return msg.reply(err);
      msg.reply("Voici un chien rien que pour vous 💕", {
        file: image
      })
    })
  } else if (command === 'chat') {
    // msg.reply('Voici un chat rien que pour vous 😻 \n https://lorempixel.com/1280/720/cats')
    msg.reply("plus dispo...")
  } else if (command === 'chuck') {
    chuck(function (err, fact) {
      if (err) return msg.reply(err);
      msg.channel.send(`${fact}`)
    })
  }
  if (command === 'quote') {
    quote(function (err, quote) {
      if (err) return msg.reply(err);
      msg.reply(`${quote}`)
    })
  }
  if (command === 'pewds') {
    // console.dir(JSON.stringify(msg))
    diffSub((err, diff) => {
      if (err) return msg.reply(err);
      msg.reply(`${diff}`)
    })

  }

  if (isReady && command === 'play') {
    execute(msg, serverQueue);
    return;
  } else if (isReady && command === 'skip') {
    skip(msg, serverQueue);
    return;
  } else if (isReady && command === 'stop') {
    stop(msg, serverQueue);
    return;
  } else if (command === 'volume') {
    volume = parseInt(args[1], 10) / 100
    serverQueue.connection.dispatcher.setVolumeLogarithmic(volume)

  } else if (command === "et ça fait") {
    msg.channel.send("BIM BAM BOUM!")
    voiceChan = msg.member.voice.channel
    if (voiceChan && isReady) {
      voiceChan.join().then(con => {
        isReady = false
        dispatcher = con.play(path.join(songsPath, 'Carla - Bim Bam toi (Clip Officiel).mp3'))
        console.log(dispatcher)
        dispatcher.setVolumeLogarithmic(0.5)
        dispatcher.on("end", end => {
          console.log('end :', end);
          voiceChan.leave()
          // fs.unlink(path.join(songsPath,token), console.error)
          isReady = true
        })
      }).catch(console.error)
    }
  } else if (msg.author.username === "WolfVic" && command === "debug") {
    msg.channel.send("debug: ")
  } else if (isReady && command === 'voice') {
    voiceChan = msg.member.voice.channel
    if (!voiceChan) {
      return msg.reply(" TU DOIS ETRE EN VOCAL CONNARD!")
    }
    if (args.length > 0) {
      isReady = false;
      const params = {
        text: args,
        voice: 'fr-FR_ReneeV3Voice', // Optional voice
        accept: 'audio/ogg;codecs=opus'
      };
      let audio = await textToSpeech.synthesize(params)
      voiceChan.join().then(async con => {
        dispatcher = con.playStream(audio.result)
        // dispatcher = con.playStream(audio.result);
        dispatcher.setVolumeLogarithmic(1)
        dispatcher.on("finish", end => {
          voiceChan.leave()
          // fs.unlink(path.join(songsPath,tokenSong), console.error)
          isReady = true
        })
      })
    }
  } else if (command === 'stop') {
    msg.member.voice.channel.leave()
    // fs.unlink(path.join(songsPath,tokenSong), console.error)
    isReady = true
  } else if (command === 'speak') {
    voiceChan = msg.member.voice.channel
    if (isReady && voiceChan) {
      voicerss.speech({
        key: process.env.VOICERSS_KEY,
        hl: 'fr-fr',
        src: args.join(' '),
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
            dispatcher = con.play('./songs/test.mp3')
            dispatcher.setVolumeLogarithmic(1)
            dispatcher.on("finish", end => {
              voiceChan.leave()
              isReady = true
            })
          })
        }
      })
    }
  } else if (command === 'timer') {
    msg.channel.send(await timer(msg.content.split(' ')))
  } else if (command === 'rec') {
    const voiceChannel = msg.member.voice.channel
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
              const audioStream = receiver.createStream(user, {
                mode: 'opus',
                end: 'silence'
              });
              dispatcher.destroy()
              dispatcher = conn.play(audioStream);
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
  } else if (command === "genius") {
    voiceChan = msg.member.voice.channel
    if (isReady && voiceChan) {
      const track = msg.content.slice('genius'.length)
      if (track.length > 2) {
        const [text, title] = await lyrics(track)
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
              dispatcher = con.play('./songs/lyrics.mp3')
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
  } else if (command === 'random') {
    const args = msg.content.split(' ');
    const nbs = await random.generateIntegers({
      min: args[1] ? args[1] : 0,
      max: args[2] ? args[2] : 10,
      n: args[3] ? args[3] : 1
    });
    // console.log('nbs :', nbs);
    msg.channel.send(nbs.random.data.join(' '))
  } else if (command ===  'definition' || command ===  'définition' || command ===  'def') {
    const args = msg.content.split(' ');
    try {
      const res = await dict(args[1])
      msg.channel.send(res)
    } catch (e) {
      console.error('e :', e);
      msg.channel.send(e)
    }
  } else if (command === 'help') {
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
  } else if (msg.channel.type == 'dm' && msg.author.username === "WolfVic") {
    if (msg.content.toLowerCase().startsWith() === "git") {
      let args = msg.content.toLowerCase().split(' ')
      if (args.length > 2 && args[1] == 'update') {
        if (args[2] == 'ms') exec("~/updateMS.sh")
        else if (args[2] == 'ml') exec('~/updateML.sh')
      }

    }
  }
  console.log(msg.channel.type)
});

async function execute(msg, serverQueue) {
  const args = msg.content.split(' ');

  const voiceChannel = msg.member.voice.channel;
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
  if (!msg.member.voice.channel) return msg.channel.send('You have to be in a voice channel to stop the music!');
  if (!serverQueue) return msg.channel.send('There is no song that I could skip!');
  serverQueue.connection.dispatcher.destroy();
}

function stop(msg, serverQueue) {
  if (!msg.member.voice.channel) return msg.channel.send('You have to be in a voice channel to stop the music!');
  serverQueue.songs = [];
  console.log(serverQueue.connection.dispatcher)
  serverQueue.connection.dispatcher.destroy();
  serverQueue.voiceChannel.leave();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(song)
  const dispatcher = serverQueue.connection.play(ytdl(song.url))
    .on('finish', () => {
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
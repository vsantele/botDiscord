module.exports = {
  name: 'rec',
  description: 'enregistre la voix des personnes dans le channel',
  execute(message, args) {
    //! A refaire...
    // const voiceChannel = message.member.voice.channel
    // //console.log(voiceChannel.id);
    // if (!voiceChannel || voiceChannel.type !== 'voice') {
    //   return message.reply(`I couldn't find the channel ${channelName}. Can you spell?`);
    // }
    // voiceChannel.join()
    //   .then(conn => {
    //     let dispatcher;
    //     message.reply('ready!');
    //     // create our voice receiver
    //     const receiver = conn.createReceiver();
    //     conn.on('ready', () => {
    //       dispatcher = conn.play(new Silence(), {
    //         type: 'opus'
    //       });
    //     })
    //     conn.on('speaking', (user, speaking) => {
    //       if (speaking) {
    //         //   console.log(user)
    //         if (user.username === 'WolfVic') {
    //           const outputStream = generateOutputFile(voiceChannel, user);
    //           const audioStream = receiver.createStream(user, {
    //             mode: 'opus',
    //             end: 'silence'
    //           });
    //           dispatcher.destroy()
    //           dispatcher = conn.play(audioStream);
    //           audioStream.pipe(outputStream)
    //           // when the stream ends (the user stopped talking) tell the user
    //           audioStream.on('end', () => {
    //             message.channel.send(`I'm no longer listening to ${user}`);
    //             voiceChannel.leave()
    //           });

    //         }
    //         // message.channel.send(`I'm listening to ${user}`);
    //         // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
    //         // create an output stream so we can dump our data in a file
    //         // pipe our audio data into the file stream
    //       }
    //     });
    //   })
    //   .catch(console.log);

  }
}
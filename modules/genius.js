const genius = require('genius-lyrics')
require('dotenv').config();

const Genius = new genius.Client(process.env.GENIUS_TOKEN)

const lyrics = async (track) => {
  let res = []
  if (track.length > 2) {
      try {
        console.log('track :', track);
        const songs = await Genius.songs.search(track)
        const song = songs[0]
        const lyrics = await song.lyrics()
        const infos = {
          fullTitle: song.fullTitle,
          title: song.title,
          image: song.image,
          url: song.url,
          artist: song.artist,
          album: song.album,
          releasedAt: song.releasedAt
        }
        //.split('\n').filter(line => !line.startsWith('[')).join('\n')
        res[0] = lyrics
        res[1] = song.fullTitle
        res[2] = infos
        return res
      } catch (error) {
        throw new Error(error)
      }
  }
}

module.exports = {
  lyrics
}
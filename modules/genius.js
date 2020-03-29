const genius = require('genius-lyrics')
require('dotenv').config();

const Genius = new genius.Client(process.env.GENIUS_TOKEN)

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
          throw new Error(error)
      }
  }
}

module.exports = {
  lyrics
}
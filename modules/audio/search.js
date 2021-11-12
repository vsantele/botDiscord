const searchYoutube = require("youtube-api-v3-search")
require("dotenv").config()

async function youtube(words) {
  const option = {
    q: words,
    part: "snippet",
    type: "video",
  }
  let result = await searchYoutube(process.env.YOUTUBE_TOKEN, option)
  return result
}

module.exports = {
  youtube,
}

const voicerss = require("../../voicerrs")
require("dotenv").config()
const bufferToReadable = require("../bufferToReadable")
const util = require("util")

const speech = async (msg, lang) => {
  return new Promise((resolve, reject) =>
    voicerss.speech({
      key: process.env.VOICERSS_KEY,
      hl: lang,
      src: msg,
      r: 0,
      c: "mp3",
      f: "44khz_16bit_stereo",
      ssml: false,
      b64: false,
      callback: (err, content) => {
        if (err) return reject(err)
        resolve(content)
      },
    })
  )
}

async function speak(msg, lang) {
  try {
    let res = await speech(msg, lang)
    return bufferToReadable(res)
  } catch (error) {
    throw error
  }
}
module.exports = speak

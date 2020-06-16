const path = require('path')
const songs = [
  {
    title: "Bah Dites Donc!",
    keywords: ["bah dites donc", "dites donc"],
    src: "../songs/expressions/bahDitesDonc.ogg",
    type:"file"
  }

];

const Database = require('../database')
async function main() {

  Database.load()
  return Database.write('expressions', songs)

}

main().catch(console.error);
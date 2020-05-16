const path = require('path')
const songs = [
  {
    title: "accélère Champion!",
    keywords: ['accélère', "accelere"],
    src: "../songs/nounours/accelere.ogg"
  },
  {
    title: "T'es adopté",
    keywords: ["adopté", "adopte", "tu es adopté"],
    src: "../songs/nounours/adopte.ogg"
  },
  {
    title: "Ah",
    keywords: ['a', "ah"],
    src: "../songs/nounours/ah.ogg"
  },
  {
    title: "Alcool, Sexe, Drogue",
    keywords: ['alcool ', "sexe", "drogue"],
    src: "../songs/nounours/alcool.ogg"
  },
  {
    title: "Mère 1",
    keywords: ['mère 1', "mere 1", "mere1", "nicolas", "grosse pute"],
    src: "../songs/nounours/mere1.ogg"
  },
  {
    title: "Mère 2",
    keywords: ['mère 2', "mere 2", "mere2"],
    src: "../songs/nounours/mere2.ogg"
  },
  {
    title: "Miaouw",
    keywords: ['miaouw', "miaou"],
    src: "../songs/nounours/miaouw.ogg"
  },
  {
    title: "mixtape1",
    keywords: ['mixtape 1', "mix 1", "mixtape1", "mix1"],
    src: "../songs/nounours/mixtape1.ogg"
  },
  {
    title: "mixtape2",
    keywords: ['mixtape 2', "mix 2", "mixtape2", "mix2"],
    src: "../songs/nounours/mixtape2.ogg"
  },
  {
    title: "Je veux mourir",
    keywords: ['mourir', "mort"],
    src: "../songs/nounours/mourir.ogg"
  },
  {
    title: "A tout de suite patron",
    keywords: ['patron', "a tout de suite", "tout de suite patron", "a tout de suite patron",],
    src: "../songs/nounours/patron.ogg"
  },
  {
    title: "accélère Champion!",
    keywords: ['accélère', "accelere"],
    src: "../songs/nounours/accelere.ogg"
  },
  {
    title: "Tient salope",
    keywords: ['salope'],
    src: "../songs/nounours/salope.ogg"
  },

];

const Database = require('../database')
async function main() {
  
  Database.load()
  return Database.write('nounours', songs)

}

main().catch(console.error);
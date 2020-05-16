const path = require('path')
const Datastore = require('nedb')
const db = require('./db')

function load() {
  if (!db.nournours) {
    db.nounours = new Datastore({ filename: path.join(__dirname, 'nounours.db'), autoload: true })
  }
  if (!db.servers) {
    db.servers = new Datastore({ filename: path.join(__dirname, 'servers.db'), autoload: true })
  }
  console.log("Databases loaded")
  return db;
}

module.exports = load
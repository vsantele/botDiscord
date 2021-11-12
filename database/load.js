const path = require("path")
const Datastore = require("nedb")
const db = require("./db")

function load() {
  if (!db.nournours) {
    db.nounours = new Datastore({
      filename: path.join(__dirname, "./db/nounours.db"),
      autoload: true,
    })
  }
  if (!db.servers) {
    db.servers = new Datastore({
      filename: path.join(__dirname, "./db/servers.db"),
      autoload: true,
    })
  }
  if (!db.expressions) {
    db.expressions = new Datastore({
      filename: path.join(__dirname, "./db/expressions.db"),
      autoload: true,
    })
  }
  console.log("Databases loaded")
  return db
}

module.exports = load

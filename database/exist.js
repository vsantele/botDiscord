const db = require('./db')


function exist(dbName) {
  return db.hasOwnProperty(dbName)
}

module.exports = exist
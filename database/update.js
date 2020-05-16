const db = require('./db')

function update(dbName, id, update, ) {
  return new Promise((resolve, reject) => {
    switch (dbName) {
      case "nounours":
        db.nounours.update({_id: id}, update, (err) => {
          if (err) return reject(err);
          return resolve(true)
        })
      case "servers":
        reject(new Error("not implemented yet"))
      default:
        reject(new Error("Unknown database"))
    }
  })
}

module.exports = update
const db = require('./db')

function write(dbName, row) {
  return new Promise((resolve, reject) => {
    switch (dbName) {
      case "nounours":
        db.nounours.insert(row, (err, newDocs) => {
          if (err) return reject(err);
          return resolve(newDocs)
        })
        break
      case "servers":
        reject(new Error("not implemented yet"))
        break
      default:
        reject(new Error("Unknown database"))
    }
  })
}

module.exports = write
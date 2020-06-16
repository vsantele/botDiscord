const db = require('./db')
const exist = require('./exist')

function write(dbName, row) {
    return new Promise((resolve, reject) => {
      if (exist(dbName)) {
        db[dbName].insert(row, (err, newDocs) => {
          if (err) return reject(err);
          return resolve(newDocs)
        })
      } else {
        reject(new Error("Unknown database"))
      }
    })
}

module.exports = write
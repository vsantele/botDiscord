const db = require('./db')

function write(dbName, row) {
    return new Promise((resolve, reject) => {
      if (exist(dbName)) {
        db[dbName].insert(row, (err, newDocs) => {
          if (err) return reject(err);
          return resolve(newDocs)
        })
      }
      reject(new Error("Unknown database"))
    })
}

module.exports = write
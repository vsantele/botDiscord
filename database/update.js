const db = require("./db")
const exist = require("./exist")

function update(dbName, id, update) {
  return new Promise((resolve, reject) => {
    if (exist(dbName)) {
      db[dbName].update(
        {
          _id: id,
        },
        update,
        (err) => {
          if (err) return reject(err)
          return resolve(true)
        }
      )
    } else {
      reject(new Error("Unknown database"))
    }
  })
}

module.exports = update

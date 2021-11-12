const db = require("./db")
const exist = require("./exist")

function remove(dbName, id) {
  return new Promise((resolve, reject) => {
    if (exist(dbName)) {
      db[dbName].remove(
        {
          _id: id,
        },
        {},
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

module.exports = remove

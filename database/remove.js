const db = require('./db')

function remove(dbName, id) {
  return new Promise((resolve, reject) => {
    
    switch (dbName) {
      case "nounours":
        db.nounours.remove({
          _id: id
        }, {}, (err) => {
          if (err) return reject(err);
          return resolve(true)
        })
      case "expressions":
        db.expressions.delete({
          _id: id
        }, {}, (err) => {
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

module.exports = remove
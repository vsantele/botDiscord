const db = require('./db');

function all(dbName) {
  return new Promise((resolve, reject) => {
    switch (dbName) {
      case "nounours":
        db.nounours.find({}).sort({title: 1}).exec((err, docs) => {
          if (err) return reject(err);
          return resolve(docs)
        })
        break;
      case "servers":
        db.servers.find({}, (err, docs) => {
          if (err) return reject(err);
          return resolve(docs)
        })
        break;
      default:
        reject(new Error("Unknown database"))
    }
  })
}

function search(dbName, value) {
  return new Promise((resolve, reject) => {
    switch (dbName) {
      case "nounours":
        db.nounours.findOne({
          keywords: value
        }, (err, docs) => {
          if (err) return reject(err);
          return resolve(docs)
        })
        break;
      case "servers":
        reject(new Error("Not implemented yet"))
        break;
      default:
        reject(new Error("Unknown database"))
    }
  })
}

module.exports = {
  all,
  search
};
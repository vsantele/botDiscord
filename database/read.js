const db = require('./db');

function all(dbName, options = {title: 1}) {
  return new Promise((resolve, reject) => {
    if (exist(dbName)) {
      if (dbName == "servers") options = {}
      db[dbName].find({}).sort(options).exec((err, docs) => {
        if (err) return reject(err);
        return resolve(docs)
      })
    }
    reject(new Error("Unknown database"))
  })
}

function search(dbName, value) {
   return new Promise((resolve, reject) => {
     if (exist(dbName)) {
       db[dbName].find({}).findOne({
         keywords: value
       }, (err, docs) => {
         if (err) return reject(err);
         return resolve(docs)
       })
     }
     reject(new Error("Unknown database"))
   })
}

module.exports = {
  all,
  search
};
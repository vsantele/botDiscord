const db = require('./db');
const exist = require('./exist')

function all(dbName, options = {title: 1}) {
  return new Promise((resolve, reject) => {
    if (exist(dbName)) {
      if (dbName == "servers") options = {}
      db[dbName].find({}).sort(options).exec((err, docs) => {
        if (err) return reject(err);
        return resolve(docs)
      })
    } else {
      reject(new Error("Unknown database"))
    }
  })
}

function search(dbName, query) {
   return new Promise((resolve, reject) => {
     if (exist(dbName)) {
       db[dbName].findOne(query, (err, docs) => {
         if (err) return reject(err);
         return resolve(docs)
       })
     } else {
       reject(new Error("Unknown database"))
     }
   })
}

module.exports = {
  all,
  search
};
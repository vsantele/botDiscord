const db = require('./db.js');
const load = require('./load.js')
const read = require('./read.js')
const write = require('./write.js')
const update = require('./update.js')
module.exports = {
  db,
  load,
  read,
  write,
  update
}
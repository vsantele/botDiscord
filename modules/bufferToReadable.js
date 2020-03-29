const Readable = require('stream').Readable

function bufferToReadable(buffer) {
  const readable = new Readable()
  readable._read = () => {} // _read is required but you can noop it
  readable.push(buffer)
  readable.push(null)
  return readable
}
module.exports = bufferToReadable
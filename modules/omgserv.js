const got = require("got")
async function omg() {
  const servId = process.env.OMGSERV_ID
  if (servId === undefined)
    throw new Error("env variable OMGSERV_ID is not defined")
  const url = `https://panel.omgserv.com/json/${servId}/status`

  try {
    const response = await got(url)
    const result = JSON.parse(response.body)
    const infos = {}
    const isOnline = result.status.online
    infos.isOnline = isOnline
    if (isOnline) {
      infos.nbPlayers = result.status.players.online
      infos.cpu = result.status.cpu
    }
    return infos
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { omg }

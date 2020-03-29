const request = require('request');
require('dotenv').config();
const diffSub = async callback => {
  const url = 'https://www.googleapis.com/youtube/v3/channels?id=UC-lHJZR3Gqxm24_Vd_AJ5Yw,UCq-Fj5jknLsUf-MWSy4_brA&part=statistics&key=' + process.env.YOUTUBE_TOKEN
  request(url, (err, res, body) => {
      if (err) return console.error(err)
      try {
          console.log('body :', body);
          var result = JSON.parse(body)
          let arrSub = result.items.map(chan => {
              return {
                  sub: chan.statistics.subscriberCount,
                  id: chan.id,
                  view: chan.statistics.viewCount
              }
          }) // 0: Pew 1: Tse
          let diff = arrSub[0].sub - arrSub[1].sub
          let diffV = arrSub[0].view - arrSub[1].view
          if (arrSub[0].id !== 'UC-lHJZR3Gqxm24_Vd_AJ5Yw') {
              diff = 0 - diff;
              diffV = 0 - diffV
          }
          callback(null, `PewDiePie a ${diff} abonnés de plus que T-Series! et il y a une différence de ${diffV} vues`)
      } catch (e) {
          callback(e)
      }
  })
}

module.exports = {
  diffSub
}
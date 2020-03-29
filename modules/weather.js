const got = require('got')
require('dotenv').config();

var darksky = async () => {
  var url = `https://api.darksky.net/forecast/${process.env.DARKSKY_TOKEN}/50.7459924,3.2171203?lang=fr&units=si&exclude=flags,hourly`;

  try {
    const result = await got(url).json();
    var previsions = {
      currently: {
        summary: result.currently.summary,
        icon: result.currently.icon,
        temperature: result.currently.temperature
      },
      nextHour: {
        summary: result.minutely.summary,
        icon: result.minutely.icon
      },
      nextDay: {
        summary: result.daily.data[1].summary,
        icon: result.daily.data[1].icon,
        temperatureHigh: result.daily.data[1].temperatureHigh,
        temperatureLow: result.daily.data[1].temperatureLow
      }
    };
    return previsions
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  darksky
}
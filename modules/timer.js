const timer = new Map()

async function delay(name, delayInMin) {
  return new Promise(resolve => {
    timer.set(name, setTimeout(() => {
      timer.delete(name)
      resolve(name);
    }, delayInMin * 60000));
  });
}

module.exports = {
  delay,
}
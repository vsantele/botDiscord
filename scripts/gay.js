const Database = require('../database')
async function main() {

  Database.load()
  await Database.write('gayPasses', {
    pseudo: 'wolfvic',
    gay: 0
  })
  await Database.write('gayPasses', {
    pseudo: 'tatanne',
    gay: 0
  })
  await Database.write('gayPasses', {
    pseudo: 'msieudavid',
    gay: 0
  })
  await Database.write('gayPasses', {
    pseudo: 'jawks',
    gay: 0
  })
  await Database.write('gayPasses', {
    pseudo: 'nyx',
    gay: 0
  })
}

main().catch(console.error);
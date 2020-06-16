function create(name,passes = 0) {
  return {
    name: String(name),
    passes: Number(passes)
  }
}

module.exports = {create}
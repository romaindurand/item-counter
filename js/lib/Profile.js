const KeyBinding = require('./KeyBinding')

class Profile {
  constructor (name) {
    if (!name) throw new Error('invalid parameters (name/conf)')
    if (typeof name === 'string') {
      this.name = name
      this.bindings = []
    } else if (typeof name === 'object') {
      const conf = name
      this.bindings = conf.bindings.map(binding => {
        return new KeyBinding(conf)
      })
    } else throw new Error('parameter must be either a string or a config object')
  }

  addBinding () {
    const conf = this.bindings.find(binding => binding.reset) ? undefined : {reset: true}
    const keyBinding = new KeyBinding(conf)
    this.bindings.push(keyBinding)
    return keyBinding
  }
}

module.exports = Profile

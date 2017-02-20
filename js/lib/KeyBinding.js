class KeyBinding {
  constructor (conf = {}) {
    this.reset = conf.reset || false
    this.shortcut = conf.shortcut || this.reset ? 'r' : 'a'
    this.counter = conf.counter || 0
    this.image = this.reset ? 'reset.png' : conf.image || 'icon.png'
  }
}

module.exports = KeyBinding

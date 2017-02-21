class KeyBinding {
  constructor (conf = {}) {
    this.reset = conf.reset || false
    this.shortcut = conf.shortcut || (this.reset ? 'r' : 'a')
    this.counter = conf.counter || 0
    this.image = conf.image || (this.reset ? 'reset.png' : 'icon.png')
  }
}

module.exports = KeyBinding

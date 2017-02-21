const path = require('path')
const $ = require('jquery')
const BaseView = require('./base')
const KeyBinding = require('../lib/KeyBinding')
const dialog = require('electron').remote.dialog

class KeyBindingView extends BaseView {
  constructor (db, keyBindingConf = {}) {
    super(db)
    this.keyBinding = new KeyBinding(keyBindingConf)
    this.callbacks = {}
    this.$el = this.render()
    this.bindEvents()
  }

  render () {
    this.keyBinding = this.keyBinding || {}
    return $(`
      <li class="list-group-item"${this.keyBinding.reset ? ' style="background-color:#EEE"' : ''}>
        <img class="media-object pull-left" src="images/${this.keyBinding.reset ? 'reset.png' : (this.keyBinding.image || 'icon.png')}" width="32" height="32">
        <div class="media-body" style="position:relative">
          <span class="binding" style="display:block;width:120px;text-align:center;border:1px solid #DDD">${this.keyBinding.shortcut ? this.keyBinding.shortcut.toUpperCase() : ''}</span>
          <input class="form-control" placeholder="Press any key" type="text" style="display:none;width:120px;text-align:center;" />
          <button class="btn btn-negative pull-right" style="position:absolute;top:0;right:0">
            <span class="icon icon-cancel-circled" style="color:white"></span>
          </button>
        </div>
      </li>`)
  }

  bindEvents () {
    this.$el.find('img').click(this.handleImgClick.bind(this))

    this.$el.find('.binding').click(this.handleBindingCLick.bind(this))

    this.$el.find('.btn-negative').click(() => {
      if (typeof this.callbacks.delete !== 'function') return console.error('No delete callback for this key-binding view')
      this.callbacks.delete(this.keyBinding)
    })
  }

  handleImgClick () {
    dialog.showOpenDialog({
      title: 'Select an image file',
      defaultPath: path.join(__dirname, '../../images/'),
      filters: [{
        name: 'image',
        extensions: ['png', 'jpg', 'gif', 'jpeg', 'webp']
      }]
    }, fileNames => {
      if (fileNames === undefined) return
      var fileName = fileNames[0].split('\\').pop()
      this.keyBinding.image = fileName
      this.callbacks.bindingChange(this.keyBinding)
      this.$el.find('img').attr('src', `images/${fileName}`)
    })
  }

  handleBindingCLick () {
    this.$el.find('.binding').hide()
    this.$el.find('input').show().focus()
    this.$el.find('input').keyup(event => {
      event.preventDefault()
      this.keyBinding.shortcut = event.key
      this.callbacks.bindingChange(this.keyBinding)
      this.$el.find('.binding').text(event.key.toUpperCase())
      this.$el.find('input').hide().val('')
      this.$el.find('.binding').show()
      this.$el.find('input').off('keyup')
    })
  }

  on (eventName, callback) {
    this.callbacks[eventName] = callback
  }
}

module.exports = KeyBindingView

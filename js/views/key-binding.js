const $ = require('jquery')
const BaseView = require('./base')
const KeyBinding = require('../lib/KeyBinding')

class KeyBindingView extends BaseView {
  constructor (db, keyBindingConf = {}) {
    super(db)
    if (keyBindingConf instanceof KeyBinding) this.keyBinding = keyBindingConf
    else this.keyBinding = new KeyBinding(keyBindingConf)
    this.$el = this.render()
    this.bindEvents()
  }

  render () {
    this.keyBinding = this.keyBinding || {}
    return $(`
      <li class="list-group-item"${this.keyBinding.reset ? ' style="background-color:#EEE"' : ''}>
        <img class="media-object pull-left" src="images/${this.keyBinding.reset ? 'reset.png' : (this.keyBinding.image || 'icon.png')}" width="32" height="32">
        <div class="media-body">
          <span class="binding" style="display:block;width:120px;text-align:center;border:1px solid #DDD">${this.keyBinding.shortcut ? this.keyBinding.shortcut.toUpperCase() : ''}</span>
          <input class="form-control" placeholder="Press any key" type="text" style="display:none;width:120px;text-align:center;" />
          <button class="btn btn-negative pull-right">
            <span class="icon icon-cancel-circled" style="color:white"></span>
          </button>
        </div>
      </li>`)
  }

  bindEvents () {
    this.$el.find('.binding').click(() => {
      this.$el.find('.binding').hide()
      this.$el.find('input').show().focus()
      this.$el.find('input').keyup(event => {
        event.preventDefault()
        console.log(event)
        this.shortcut = event.key
        this.$el.find('.binding').text(event.key.toUpperCase())
        this.$el.find('input').hide().val('')
        this.$el.find('.binding').show()
        this.$el.find('input').off('keyup')
      })
    })

    this.$el.find('.btn-negative').click(() => {
      if (typeof this.onDeleteCallback !== 'function') return console.error('No onDeleteCallback for this key-binding view')
      this.onDeleteCallback(this.keyBinding)
    })
  }

  onDelete (callback) {
    this.onDeleteCallback = callback
  }
}

module.exports = KeyBindingView

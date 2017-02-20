const $ = require('jquery')
const BaseView = require('./base')
const KeyBindingView = require('./key-binding')
const Profile = require('../lib/Profile')

class ProfileView extends BaseView {
  constructor (db, nameOrConf) {
    super(db)
    this.profile = new Profile(nameOrConf)
    this.$el = this.render()
    this.name = typeof nameOrConf === 'string' ? nameOrConf : nameOrConf.name
    this.$el = this.render()
    if (typeof nameOrConf === 'string') {
      this.store.profiles.push(this.profile)
      this.addBinding()
    }
    this.refreshList()
    this.bindEvents()
  }

  render () {
    return $(`
      <div class="pane">
        <div class="toolbar-actions" style="z-index=2;background-color:#DDD;box-shadow: 0 0 10px black;margin-top:0;">
          <h4 style="text-align: center">${this.name}</h4>
          <button class="btn btn-negative pull-right">
            <span class="icon icon-cancel-circled" style="color:white"></span> Delete profile
          </button>
          <button class="btn btn-primary pull-left">
            <span class="icon icon-play" style="color:white"></span> Play !
          </button>
        </div>
        <ul class="list-group">
        </ul>
        <div>
          <button class="btn btn-positive add-binding" style="margin:auto">
            <span class="icon icon-plus" style="color:white"></span> Add binding
          </button>
        </div>
      </div>
    `)
  }

  bindEvents () {
    this.$el.find('button.add-binding').click(this.addBinding.bind(this))
    this.$el.find('.toolbar-actions button.btn-negative').click(event => {
      if (typeof this.onDeleteCallback !== 'function') return console.error('onDeleteCallback is not a function')
      this.onDeleteCallback(this)
    })
  }

  onDelete (callback) {
    this.onDeleteCallback = callback
  }

  addBinding () {
    const keyBinding = this.profile.addBinding()
    this.createKeyBindingView(keyBinding)
    this.db.save('profiles')
  }

  createKeyBindingView (keyBinding) {
    const keyBindingView = new KeyBindingView(this.db, keyBinding)
    keyBindingView.onDelete(this.deleteBinding.bind(this))
    this.$el.find('ul').append(keyBindingView.$el)
  }

  refreshList () {
    this.$el.find('li').remove()
    this.profile.bindings.forEach(this.createKeyBindingView.bind(this))
  }

  deleteBinding (bindingToDelete) {
    const index = this.profile.bindings.findIndex(binding => binding === bindingToDelete)
    if (index === -1) return
    this.profile.bindings.splice(index, 1)
    this.db.save('profiles')
    this.refreshList()
  }
}

module.exports = ProfileView

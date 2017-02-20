const $ = require('jquery')
const BaseView = require('./base')

class SettingsView extends BaseView {
  constructor (db) {
    super(db)
    db.store.settings = db.store.settings || {}
  }

  render () {
    return $(`
      <div class="pane">
        settings
      </div>
    `)
  }
}

module.exports = SettingsView

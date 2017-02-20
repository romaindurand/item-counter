const BaseView = require('./base')
const ProfileView = require('./profile')
const SettingsView = require('./settings')
const $ = require('jquery')

class NavView extends BaseView {
  constructor (db) {
    super(db)
    db.store.profiles = db.store.profiles || []
    this.profileViews = []
    this.$sidebar = this.$el.find('.sidebar')
    this.$addProfileButton = this.$el.find('button')
    this.$userAddInput = this.$sidebar.find('input')
    this.settingsView = new SettingsView(db)
    this.$el.append(this.settingsView.$el)
    this.store.profiles.forEach(profile => {
      this.addProfile(profile)
    })
    this.bindEvents()
  }

  render () {
    return $(`
    <div class="pane-group">
      <div class="pane pane-sm sidebar">
        <nav class="nav-group">
          <h5 class="nav-group-title">General</h5>
          <span class="nav-group-item settings active">
            <span class="icon icon-cog"></span> Settings
          </span>
          <h5 class="nav-group-title">Profiles</h5>
          <div class="profiles"></div>
          <input type="text" class="form-control" placeholder="Profile name" style="display:none;margin:5px;width:210px">
          <button type="submit" class="btn btn-positive pull-right" style="margin:5px">
            <span class="icon icon-plus icon-text" style="color:white"></span> Add profile
          </button>
        </nav>
      </div>
    </div>`)
  }

  bindEvents () {
    this.$sidebar.find('.settings').click(this.showSettings.bind(this))
    this.$addProfileButton.click(event => {
      this.$addProfileButton.hide()
      this.$userAddInput.show().focus()
    })
    this.$userAddInput.keyup(event => {
      if (event.key === 'Enter') {
        if (!this.$userAddInput.val()) return
        const profileName = this.$userAddInput.val()
        this.addProfile(profileName)
        this.$userAddInput.val('').hide()
        this.$addProfileButton.show()
      }
      if (event.key === 'Escape') {
        this.$userAddInput.hide()
        this.$addProfileButton.show()
      }
    })

    this.store.profiles
  }

  showSettings (event) {
    this.$sidebar.find('.active').removeClass('active')
    this.$sidebar.find('.settings').addClass('active')
    this.hideAllChilds()
    this.settingsView.show()
  }

  getNavItem (name) {
    return $(`
      <span class="nav-group-item active">
        <span class="icon icon-user"></span> ${name}
      </span>`)
  }

  addProfile (nameOrConf) {
    const name = typeof nameOrConf === 'string' ? nameOrConf : nameOrConf.name
    const $navProfileItem = this.getNavItem(name)
    $navProfileItem.click(this.handleProfileNav.bind(this, name, $navProfileItem))
    this.$sidebar.find('.active').removeClass('active')
    this.$sidebar.find('.profiles').append($navProfileItem)
    const profile = new ProfileView(this.db, nameOrConf)
    profile.onDelete(this.deleteProfile.bind(this, $navProfileItem))
    this.profileViews.push(profile)
    this.hideAllChilds()
    this.$el.append(profile.$el)
    this.db.save('profiles')
  }

  handleProfileNav (name, $navProfileItem) {
    this.$sidebar.find('.active').removeClass('active')
    $navProfileItem.addClass('active')
    this.hideAllChilds()
    const activeProfileView = this.profileViews.find(profileView => profileView.profile.name === name)
    activeProfileView.$el.show()
  }

  deleteProfile ($navProfileItem, profileToDelete) {
    const index = this.profileViews.findIndex(profile => profile === profileToDelete)
    if (index === -1) return
    this.profileViews[index].$el.remove()
    this.profileViews.splice(index, 1)
    $navProfileItem.remove()
    this.showSettings()
  }

  createProfile () {
    const profile = new ProfileView(this.db)
    return profile
  }

  hideAllChilds () {
    this.$el.find('.pane:not(.sidebar)').hide()
  }

  on (eventName, callback) {
    if (eventName === 'play') {
      // debugger
    }
  }
}

module.exports = NavView

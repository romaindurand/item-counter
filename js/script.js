const $ = require('jquery')
const Profile = require('./lib/Profile')
const NavView = require('./views/nav')
const Db = require('./lib/db')
const db = new Db()

if (db.store.profiles) {
  db.store.profiles = db.store.profiles.map((profile, index) => {
    return new Profile(profile)
  })
}

const navView = new NavView(db)
$('.window-content').append(navView.$el)

navView.on('play', event => {
  debugger
})

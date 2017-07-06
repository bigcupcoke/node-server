const Model = require('./main.js')
const { log } = require('../utils.js')
class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.note = form.note || ''
        this.id = form.id
        // 权限， 默认是 2
        this.role = form.role || 2
    }

    validateLogin() {
        const u = User.findOne('username', this.username)
        return u !== null && u.password === this.password
    }

    validateRegister() {
        const validForm = this.username.length > 2 && this.password.length > 2
        const uniqueUser = User.findOne('username', this.username) === null
        log(`validaForm${validForm}\r\nuniqueUser${uniqueUser}`)
        return validForm && uniqueUser
    }
}

module.exports = User
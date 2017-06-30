const Model = require('./main.js')

class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.note = form.note || ''
    }

    validateLogin() {

    }
}

module.exports = User
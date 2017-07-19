const Model = require('./main.js')
const crypto = require('crypto')
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

    // user 单独写一个自己create 方法
    static create(form={}) {
        // 密码加盐加密
        form.password = this.saltedPassword(form.password)
        // 调 model 类的create
        const u = super.create(form)
        u.save()
        return u
    }

    // 密码加盐加密
    static saltedPassword(password, salt='') {
        // sha1 hash算法
        const _sha1 = (s) => {
            const algoritm = 'sha1'
            const hash = crypto.createHash(algoritm)
            hash.update(s)
            const h = hash.digest('hex')
            return h
        }
        const pwd = _sha1(password)
        const saltedPwd= _sha1(pwd + salt)
        return saltedPwd
    }

    static updatePassword(form={}) {
        const { username, password} = form
        const pwd = this.saltedPassword(form.password)
        const u = User.findOne('username', username)
        u.password = pwd
        u.save()
    }

    validateAuth(form={}) {
        const cls = this.constructor
        const { username, password} = form
        const pwd = cls.saltedPassword(password)
        const usernameEquals = (this.username === usenname)
        const passwordEquals = (this.password === pwd)
        return usernameEquals && passwordEquals
    }

    static login(form={}) {
        const { username, password} = form
        const pwd = this.saltedPassword(password)
        const cls = this.constructor
        const u = this.findOne('username', username)
        return u !== null && u.password === pwd
    }

    static register(form={}) {
        const { username, password} = form
        // const validForm = username.length > 2 && password.length > 2
        //todo: validForm 先写成true全部通过，方便调试
        const validForm = true

        const uniqueUser = (this.findOne('username', username) === null)
        // log('user debug', uniqueUser, this.findOne('username', this.username))
        if (validForm && uniqueUser) {
            const u = this.create(form)
            u.save()
            return u
        } else {
            return null
        }
    }
}

const test = () => {
    const form1 = {
        username: '1',
        password: '1',
    }
    // const u1 = User.create(form1)
    // log('u1 debug', u1)
    // User.register(form1)
    const form2 = {
        username: '1',
        password: '2',
    }
    const valideteLogin1 = User.login(form1)
    const valideteLogin2 = User.login(form2)
    log(valideteLogin1, valideteLogin2)
}

if (require.main === module) {
    test()
}

module.exports = User
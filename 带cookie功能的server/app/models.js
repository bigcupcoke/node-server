const fs = require('fs')
const log = require('./utils.js')

const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

// 将数据(object 或者 array)写入到文件中, 相当于持久化保存数据
const save = (path, data) => {
    const r = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, r)
}

//从数据库读取数据，并且转换成 JSON形式
const load = (path) => {
    ensureExists(path)
    const options = {
        encoding: 'utf8',
    }
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s, null, 2)
    return data
}

//主类
class Model {
    // dbPath 方法返回 db 文件的路径
    // 静态方法中的 this 指的是类
    // this.name 指的是类名, 类名是一个字符串 'Model'
    static dbPath() {
        // 文件名一般来说建议全小写, 所以这里将名字换成了小写
        const className = this.name.toLowerCase()
        const path = `${className}.txt`
        return path
    }

    static create(form={}) {
        const instance = new this(form)
        return instance
    }

    // 读取一个类db文件，生成这个类的所有实例
    static all() {
        const path = this.dbPath()
        // 拿到 models, 是一个数组, 但是这个时候他只是一个数据，
        // models 只是没有 Model 类的各种方法的死数据而已
        const models = load(path)
        //根据没条数据生成实例
        models.map((item) => this.create(item))
        return models
    }

    //保持一个类的所有实例到db中去
    save() {
        const cls = this.constructor
        const models = cls.all()
        const len = models.length
        if (this.id === undefined) {
            if (len === 0) {
                this.id = 0
            } else {
                const last = models[len -1]
                this.id = last.id + 1
            }
            models.push(this)
        } else {
            // id 存在说明这条数据已经在数据文件中了
            // 直接找到这条数据并且替换
            // 先找到这条数据的位置
            let index = -1
            models.forEach((m, i) => {
                if (m.id === this.id) {
                    index = i
                    return false
                }
            })
            if (index > -1) {
                models[index] = this
            }
        }
        // models.push(this)
        // 这里的 save 是 全局 save 函数， 不是Model类的save()方法
        const path = cls.dbPath()
        save(path, models)
    }

    static findBy(key, value) {
        const models = this.all()
        let model = null
        models.forEach((m) => {
            if (m[key] === value) {
                // log('m', m, m.key, m.value)
                model = m
                return false
            }
        })
        return model
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

//以下两个类用于实际数据的处理
class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.note = form.note || ''
    }

    validateLogin() {
        const cls = this.constructor
        const us = cls.all()
        let valid = false
        us.forEach((item) => {
            if (item.username === this.username && item.password === this.password) {
                valid = true
                return false
            }
        })
        return valid
    }

    validateRegister() {
        let valid = false
        //查找是否已经有同名称的user了
        const u = User.findBy('username', this.username)
        const validPassword = this.username.length > 2 && this.password.length > 2
        // log('u', u, u ===null && validPassword)
        return u === null && validPassword
    }
}
const testFindBy = () => {
    const form = {
        username: '123',
        password: '123',
    }
    const a = User.findBy('username', '123')
    log('a', a)
}

// test()
module.exports = {
    User: User,
    // Message: Message,
}
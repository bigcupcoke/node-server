const { log, randomStr } = require('../../utils.js')
// log('a', randomStr())
const fs = require('fs')

const enSureExist = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data, 'utf8')
    }
}

const save = (path, data) => {
    const s = JSON.stringify(data, null, 2)
    // log('debug s in save', s, data)
    fs.writeFileSync(path, s, 'utf8')
}

const load = (path) => {
    enSureExist(path)
    const options = {
        encoding: 'utf8',
    }
    const data = fs.readFileSync(path, options)
    const s =JSON.parse(data, null, 2)
    return s
}

class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.txt`
        // 使用绝对路径可以保证路径没有问题
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = []
        models.forEach((m) => {
            let model = this.create(m)
            ms.push(model)
        })
        return ms
    }

    static create(form={}) {
        const instance = new this(form)
        return instance
    }

    static findOne(key, value) {
        const models = this.all()
        let instance = null
        models.forEach((m) => {
            if (m[key] === value) {
                instance = m
                return false
            }
        })
        return instance
    }

    static find(key, value) {
        const models = this.all()
        const ms = []
        models.forEach((m) => {
            if (m[key] === value) {
                ms.push(m)
            }
        })
        return ms
    }

    // 因为经常用 id 来获取数据, 所以单独写一个 get 方法
    static get(id) {
        id = parseInt(id, 10)
        // console.log('debug id', id)
        return this.findOne('id', id)
    }

    // 删除
    static remove(id) {
        id = parseInt(id, 10)
        const models = this.all()
        const index = models.findIndex((e) => {
            return e.id === id
        })
        if (index > -1) {
            models.splice(index, 1)
        }
        const path = this.dbPath()
        save(path, models)
    }

    // 保存
    save() {
        const cls = this.constructor
        const models = cls.all()
        log('debug in Model models', models)
        if (this.id === undefined) {
            const len = models.length
            if (len > 0) {
                const last = models[len - 1]
                this.id = last.id + 1
                log('this.id', this.id, last)
            } else {
                this.id = 0
            }
            models.push(this)
        } else {
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
        const path = cls.dbPath()
        // log('path', path)
        save(path, models)
    }
}


const testSave = () => {
    const form = {
        username: 'qqq',
        password: 'qqq',
    }
    const m = Model.create(form)
    m.save()
}

const test = () => {
    testSave()
}

if (require.main === module) {
    test()
}

module.exports = Model

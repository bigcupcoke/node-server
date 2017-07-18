const { log, randomStr } = require('../utils.js')
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
        const ms = models.map((m) => {
            const instance = this._newFromDict(m)
            return instance
        })
        return ms
    }

    static create(form={}) {
        const instance = new this(form)
        // create 过程就先把实例存入数据库
        instance.save()
        return instance
    }

    static _newFromDict(dict) {
        const cls = this
        const m = new cls(dict)
        return m
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
        if (this.id === undefined) {
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                // 0 在 js 中会被处理成 false, 第一个元素的 id 设置为 1, 方便处理
                this.id = 1
            }
            models.push(this)
        } else {
            const index = models.findIndex((e) => {
                return e.id === this.id
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
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

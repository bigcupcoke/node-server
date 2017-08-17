const { log } = require('../utils')
const fs = require('fs')

const ensureExist = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data, 'utf8')
    }
}

const load = (path) => {
    ensureExist(path)
    const options = {
        encoding: 'utf8',
    }
    const data = fs.readFileSync(path, options)
    const s = JSON.parse(data, null, 2)
    return s
}

const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    const options = {
        encoding: 'utf8',
    }
    fs.writeFileSync(path, s, options)
}

class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.txt`
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((m) => {
            const instance = this.create()
            return instance
        })
        return ms
    }

    static create(form={}) {
        const instance = new this(form)
        instance.save()
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

    static get(id) {
        id = parseInt(id, 10)
        return this.findOne('id', id)
    }

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

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else  {
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
        // 现在调用的 save 方法是外面的 save
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

if (require.main === moudle) {
    test()
}

moudle.exports = Model
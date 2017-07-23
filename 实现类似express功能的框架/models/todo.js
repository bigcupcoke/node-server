const Model = require('./main')

class Todo extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.done = false
        this.user_id = form.user_id
        const now = Date.now()
        this.created_time = form.created_time || now
        this.updated_time = form.updated_time || now
    }

    // 更新作为 static 方法
    static update(form) {
        const id = Number(form.id)
        const t = this.get(id)
        t.title = form.title
        t.updated_time = Date.now()
        t.save()
    }

    static time() {
        const now = Date.now()
    }
}

if (require.main === module) {
    test()
}

module.exports = Todo
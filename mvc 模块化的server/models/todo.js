const Model = require('./main')

class Todo extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.done = false
        this.user_id = form.user_id
    }

    static update(form) {
        const id = Number(form.id)
        const t = this.get(id)
        t.title = form.title
        t.save()
    }
}


if (require.main === module) {
    test()
}

module.exports = Todo
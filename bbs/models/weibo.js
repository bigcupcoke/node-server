const Model = require('./main')
const User = require('./user')

class Weibo extends Model {
    constructor(form={}, user_id=-1) {
        super()
        this.id = form.id
        this.content = form.content || ''
        // 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        this.user_id = Number(form.user_id || user_id)
    }

    user() {
        const u = User.findOne('id', this.user_id)
        return u
    }

    comments() {
        // 在用到的时候再 require
        // 如果放在最上面 require, 会出现循环引用的情况, 导致 Comment 里 User 为 {}
        const Comment = require('./comment')

        const cs = Comment.find('weibo_id', this.id)
        return cs
    }

    static update(form={}) {
        const u = User.findOne('id', form.user_id)
        u.content = form.content || ''
        u.save()
    }

}

module.exports = Weibo
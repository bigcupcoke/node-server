const Model = require('./main')
const User = require('./user')
const Weibo = require('./weibo')

class Comment extends Model {
    constructor(form={}, user_id=-1) {
        super()
        this.id = form.id
        this.content = form.content || ''
        // 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        this.user_id = Number(form.user_id || user_id)
        this.weibo_id = Number(form.weibo_id || -1)
    }

    user() {
        const u = User.findOne('id', this.user_id)
        return u
    }

    weibo() {
        // id 是微博的属性
        // weibo_id 是评论的属性
        const w = Weibo.findOne('id', this.weibo_id)
        return w
    }


    static del(id, user) {
        const c = this.get(id)
        if (c.user_id === user.id) {
            this.remove(id)
        }
    }
}

module.exports = Comment
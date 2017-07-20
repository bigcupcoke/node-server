const { log, error } = require('../utils')
const {
    currentUser,
    template,
    redirect,
    loginRequired,
    httpResponse,
} = require('./main')

const User = require('../models/user')
const Weibo = require('../models/weibo')
const Comment = require('../models/comment')

const index = (request) => {
    // 当前要访问页面用户的 id
    const user_id = Number(request.query.user_id)
    // 找到用户
    const u = User.get(user_id)
    const weibos = Weibo.find('user_id', u.id)
    const body = template('weibo_index.html', {
        weibos: weibos,
        user: u,
    })
    return httpResponse(body)
}

const create = (request) => {
    const body = template('weibo_new.html')
    return httpResponse(body)
}


const add = (request) => {
    const u = currentUser(request)
    const form = request.form()
    const w = Weibo.create(form)
    log('weibo add', w)
    w.user_id = u.id
    w.save()
    return redirect(`/weibo/index?user_id=${u.id}`)
}

const commentAdd = (request) => {
    const u = currentUser(request)
    const form = request.form()
    const c = Comment.create(form)
    c.user_id = u.id
    c.save()

    // 用户在某一个微博下面发表了评论
    // 在 comment 里面添加查找对应 weibo 的方法
    const w = c.weibo()

    // 然后根据 weibo 信息查找 user
    const user = w.user()
    return redirect(`/weibo/index?user_id=${user.id}`)
}

const routeMapper = {
    '/weibo/index': loginRequired(index),
    '/weibo/new': loginRequired(create),
    '/weibo/add': add,
    '/comment/add': loginRequired(commentAdd),
}

module.exports = routeMapper
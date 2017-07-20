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
    // 当前登录用户的 id
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

const commentAdd = () => {

}


const routeMapper = {
    '/weibo/index': loginRequired(index),
    '/weibo/new': create,
    '/weibo/add': add,
}

module.exports = routeMapper
const fs = require('fs')
const { log, randomStr } = require('../utils')
const {
    session,
    currentUser,
    template,
    headerFromMapper,
    redirect,
    loginRequired,
} = require('./main.js')

const User = require('../models/user')

const login = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateLogin()) {
            const sid = randomStr()
            session[sid] = u.username
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const u = currentUser(request)
    let username = u ? u.username : ''
    let body = template('login.html')
    body = body.replace('{{username}}', username)
    body = body.replace('{{result}}', result)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        log('u', u, request)
        if (u.validateRegister()) {
            u.save()
            const models = User.all()
            const us = JSON.stringify(models, null, 2)
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名和密码长度必须大于2或者用户名已经存在'
        }
    } else {
        result = ''
    }
    let body = template('register.html')
    body = body.replace('{{result}}', result)
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const  r = header + '\r\n' + body
    return r
}

const admin = (request) => {
    const u = currentUser(request)
    // log('users', request)
    let users
    if (u.id === 1) {
        const all = User.all()
        // log('users', users)
        users = all.map((u) => {
            const t =  `
                <div>username: ${u.username}   passowrd: ${u.password}   id: ${u.id}</div> 
            `
            return t
        }).join('')
    } else {
        users = '<h1>你没有权限</h1>>'
    }
    let body = template('admin.html')
    body = body.replace('{{users}}', users)
    const headers = {
        'Content-Type': 'text/html; charset=utf8',
    }
    // log('body', body)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const routeUser = {
    '/login': login,
    '/register': register,
    '/admin/user': loginRequired(admin),
}

const test = () => {

}

if (require.main === module) {
    test()
}

module.exports = routeUser
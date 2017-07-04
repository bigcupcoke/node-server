const fs = require('fs')
// const User = require('../models/user.js')
const { log } = require('../utils.js')

const User = require('../models/user.js')
const Requset = require('../request.js')
const session = {}

const currentUser = (request) => {
    const id = request.cookies.user || ''
    const username = session[id]
    const u = User.findOne('username', username)
    return u
}

// 读取 html 文件的函数
// 把页面的内容写入 html 文件中
const template = (name) => {
    const path = `../templates/${name}`
    const options = {
        encoding: 'utf8',
    }
    // log('path', path)
    const s = fs.readFileSync(path, options)
    // log('s', s)
    return s
}

const headerFromMapper = (mapper={}, code=200) => {
    const base = `HTTP/1.1 ${code} OK\r\n`
    const keys = Object.keys(mapper)
    const  s = keys.map((k) => {
        let v = mapper[k]
        return `${k}: ${v}\r\n`
    }).join('')
    const header = base + s
    return header
}

//重定向函数
const redirect = (url) => {
    const headers = {
        location: url,
    }
    const header = headerFromMapper(headers, 302)
    const body = ''
    const r = header + '\r\n' + body
    log('r', r)
    return r
}

// 检查是否已经登录的装饰器
const loginRequired = (routeFunc) => {
    const func = (request) => {
        const u = currentUser(request)
        log('u in loginRequired', u)
        if (u === null) {
            return redirect('/login')
        } else {
            return routeFunc(request)
        }
    }
    return func
}

module.exports = {
    session: session,
    currentUser: currentUser,
    template: template,
    headerFromMapper: headerFromMapper,
    redirect: redirect,
    loginRequired: loginRequired,
}

// const setName = function(obj) {
//     obj.name = 'dake'
//     console.log('obj', obj)
//     obj = new Object
//     console.log('new obj', obj)
//     obj.name = 'erke'
// }
//
// const person = {}
// setName(person)
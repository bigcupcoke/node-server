const fs = require('fs')
const nunjucks = require('nunjucks')
const { log } = require('../utils')

const User = require('../models/user')
const Requset = require('../request')
const session = require('../models/session')

// 配置 loader, nunjucks 会从这个目录中加载模板
const loader = new nunjucks.FileSystemLoader('templates', {
    // noCache: true 是关闭缓存, 这样每次都会重新计算模板
    noCache: true,
})

// 用 loader 创建一个环境, 用这个环境可以读取模板文件
const env = new nunjucks.Environment(loader)

// 查找当前用户
const currentUser = (request) => {
    const s = request.cookies.session || ''
    log('s in currentuser', s)
    if(s.length > 0) {
        const r = session.decrypt(s)
        const uid = r.uid
        const u = User.findOne('id', uid)
        return u
    } else {
        return null
    }
}

// 读取 html 文件的函数
// 把页面的内容写入 html 文件中
const template = (path, data) => {
    const s = env.render(path, data)
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

const httpResponse = (body, headers=null) => {
    let mapper = {
        'Content-Type': 'text/html',
    }
    if (headers !== null) {
        mapper = Object.assign(mapper, headers)
    }
    const header = headerFromMapper(mapper)
    const r = header + '\r\n' + body
    return r
}

//重定向函数
const redirect = (url) => {
    const headers = {
        location: url,
    }
    const header = headerFromMapper(headers, 302)
    const body = ''
    const r = header + '\r\n' + body
    // log('r', r)
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
    httpResponse: httpResponse,
}
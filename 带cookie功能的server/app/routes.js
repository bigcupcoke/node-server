const fs = require('fs')
const log = require('./utils.js')

const models = require('./models')
const User = models.User

const Request = require('./request.js')
//使用一个全局变量保持session的一些东西
// const 嘟嘟嘟 = {}
const session = {}

// user=dewfd7vd3uom6skw
// user=uvbmsn6e6bfdjag6

const randomStr = () => {
    const seed = 'asdfghjokpwefdsui3456789dfghjk67wsdcfvgbnmkcvb2e'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * (seed.length - 2)
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

const currentUser = (request) => {
    // log('request', request)
    const id = request.cookies.user || ''
    const username = session[id] || '游客'
    log('debug session', session, [id], request.cookies)
    return username
}

const template = (pathname) => {
    const path = `../templates/${pathname}`
    const options = {
        encoding: 'utf8',
    }
    const s = fs.readFileSync(path, options)
    return s
}

//根据不同的 header 项生成完成的 header字符串
const headerFromMapper = (mapper={}) => {
    let base = 'HTTP/1.1 200 OK\r\n'
    // mapper
    // {
    //     Content-Type: 'text/html'
    // }
    const keys = Object.keys(mapper)
    const s = keys.map((k) => {
        let v = mapper[k]
        return `${k}: ${v}`
    }).join('\r\n')
    const header = base + s + '\r\n'
    return header
}

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    let body = template('index.html')
    const username = currentUser(request)
    body = body.replace('{{username}}', username)
    const r = header + '\r\n' + body
    return r
}

const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateRegister()) {
            // 如果 u 这个实例符合注册条件, 就调用 save 函数, 将这个 u 保存到文件中
            u.save()
            let us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名或者密码长度必须大于2'
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
    const r = header + '\r\n' + body
    return r
}
// const register =(request) => {
//     let result
//     if (request.method === 'POST') {
//         const form = request.form()
//         const u = User.create(form)
//         if (u.validateRegister()) {
//             u.save()
//             const us = User.all()
//             log('us', us)
//             result = `注册成功${us}`
//         } else {
//             result = `用户名或者密码长度必须大于2`
//         }
//     } else {
//         result = ''
//     }
//     let body = template('register.html')
//     body = body.replace('{{result}}', result)
//     log('body', body)
//     const headers = {
//         'Content-Type': 'text/html',
//     }
//     const header = headerFromMapper(headers)
//     const r = header + '\r\n' + body
//     return r
// }

const login = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let result
    if (request.method === "POST") {
        const form = request.form()
        const u = User.create(form)
        if (u.validateLogin()) {
            const sid = randomStr()
            session[sid] = u.username
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '登录失败'
        }
    } else {
        result = ''
    }
    const header = headerFromMapper(headers)
    log('header', [header], [headers])
    let body = template('login.html')
    const username = currentUser(request)
    body = body.replace('{{result}}', result)
    body = body.replace('{{username}}', username)
    const  r = header + '\r\n' + body
    return r
}

const routeMapper = {
    '/': index,
    '/register': register,
    '/login': login,
}

module.exports = routeMapper
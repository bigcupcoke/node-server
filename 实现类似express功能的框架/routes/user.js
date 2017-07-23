const { log, randomStr } = require('../utils')
const {
    currentUser,
    template,
    redirect,
    loginRequired,
    httpResponse,
} = require('./main')

const User = require('../models/user')
const session = require('../models/session')

const login = (request) => {
    let result
    const headers = {}
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.findOne('username', form.username)
        if(u !== null && u.validateAuth(form)) {
            const form = {
                uid: u.id,
            }
            const s = session.encrypt(form)
            headers['Set-Cookie'] = `session=${s}`
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const u = currentUser(request)
    let username = u ? u.username : ''
    log('login u', u)
    const body = template('login.html', {
        username: username,
        result: result,
    })
    return httpResponse(body, headers)
}

const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        // log('form', form)
        const u = User.register(form)
        // log('u', u)
        if (u !== null) {
            result = `注册成功`
        } else {
            result = '用户名和密码长度必须大于2或者用户名已经存在'
        }
    } else {
        result = ''
    }
    const us = User.all()
    // log('us', us)
    const body = template('register.html', {
        result: result,
        users: us,
    })
    return httpResponse(body)
}

const admin = (request) => {
    const u = currentUser(request)
    log('users', u)
    let users
    let form
    if (u.role === 1) {
        const all = User.all()
        // log('users', users)
        users = all.map((u) => {
            const t =  `
                <div>username: ${u.username}   passowrd: ${u.password}   id: ${u.id}</div> 
            `
            return t
        }).join('')
        form = `
            <form action="/admin/user/update" method="post">
                <input type="text" name="id" placeholder="id"><br>
                <input type="text" name="password" placeholder="password">
                <button type="submit">edit password</button>
            </form>
        `
    } else {
        users = '<h1>你没有权限</h1>>'
        form = ''
    }
    const body = template('admin.html', {
        user: users,
        from, form,
    })
    const headers = {
        'Content-Type': 'text/html; charset=utf8',
    }
    // log('body', body)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const update = (request) => {
    // log('request in update', request)
    if (request.method === "POST") {
        const form = request.form()
        const u = User.get(form.id)
        if (u !== null) {
            u.password = form.password
            u.save()
        }
    }
    return redirect('/admin/user')
}

const routeUser = {
    '/login': login,
    '/register': register,
    '/admin/user': loginRequired(admin),
    '/admin/user/update': update,
}

const test = () => {

}

if (require.main === module) {
    test()
}

module.exports = routeUser
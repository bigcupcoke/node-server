const net = require('net')
const fs = require('fs')
const log = require('./utils.js')
const Request = require('./request.js')
const routeMapper = require('./routes.js')
const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 200 Ok\r\nContent-Type: text\html\r\n\r\n<h1>404 NOT FOUND</h1>'
    }
    const r = e[code] || ''
    return r
}

const parsedPath = (pathname) => {
    const index = pathname.indexOf('?')
    if (index !== -1) {
        let [path, search] = pathname.split('?')
        let args = search.split('&')
        const query = {}
        args.map((m) => {
            let [k, v] = m.split('=')
            query[k] = v
        })
        return {
            path: path,
            query: query,
        }
    } else {
        return {
            path: pathname,
            query: {},
        }
    }
}

const parsedRaw = (raw) => {
    const r = raw
    const [method, url] = r.split(' ')
    const { query, path} = parsedPath(url)
    let message = r.split('\r\n\r\n')
    const headers = message[0].split('\r\n').slice(1)
    const body = message[1]
    return {
        method: method,
        path: path,
        query: query,
        headers: headers,
        body: body,
    }
}

const responseFor = (raw, request) => {
    const r = parsedRaw(raw)
    request.body = r.body
    request.query = r.query
    request.path = r.path
    request.method = r.method
    request.addHeaders(r.headers)
    const route = {}
    const routes = Object.assign(route, routeMapper)
    const response = route[r.path] || error
    const resp = response(request)
    return resp
}

const run = (host='127.0.0.1', port=3000) => {
    const server = new net.Server()
    server.listen(port, host, () => {
        const address = server.address()
        log(`listening server at http://${address.address}:${address.port}`)
    })

    server.on('connection', (s) => {
        s.on('data', (d) => {
            const request = new Request()
            const raw = d.toString()
            const response = responseFor(raw, request)
            s.write(response)
            s.destroy()
        })
    })

    server.on('error', (error) => {
        log('server error', error)
    })

    server.on('close', () => {
        log('server close')
    })
}

const __main = () => {
    run()
}

__main()

// 对每一个 Model 添加一个 id 属性, 初始值为 undefined
// 每一个 Model 的 id 是独一无二并且增长的数字
// save 的时候, 如果 id 属性为 undefined(说明当前这个实例没有 id 属性)
// 就给它赋值并添加/保存, 也就是说要给它添加一个 id 属性, 然后保存
// 如果 id 属性不为 undefined(说明当前这个实例有 id 属性) 就不用关心 id 属性,
// 直接修改其他属性并保存
//
// 用法例子如下
/*
 // 假设现在数据库如下
 [
 {
 "username": "gua",
 "password": "123",
 "id": 1
 }
 ]

 // 可以看到已经存在 username 为 'gua' 的用户, 而且有 id
 // 根据 username 取出这个用户
 const u1 = User.findBy('username', 'gua')
 // 改变 u1 的 password 属性
 u1.password = 'pwd'
 // 保存
 // 因为 u1 已经有 id 了, 所以可以直接保存
 u1.save()

 // 保存之后的数据库如下, password 属性会发生改变
 [
 {
 "username": "gua",
 "password": "pwd",
 "id": 1
 }
 ]


 const form = {
 username: 'newgua',
 password: '123',
 }
 // 先使用 form 生成一个新的 user 实例
 // 因为这是一个新用户, 并没有 id
 const u2 = User.create(form)
 console.log(u2.id) // 默认是没有 id 的, 所以 u2.id 是 undefined

 // 如果没有 id, save 的时候需要手动增加一个 id, 即 u.id = xxx
 // 具体这一步需要我们在 save 的时候手动计算, 并且赋值
 // u.id = xxx (xxx 需要我们计算出来)

 // 设置 id 属性的值, 再保存, 这样数据库添加的这条数据可以发现是有 id 的
 u2.save()

 // 保存之后的数据库如下, password 属性会发生改变
 [
 {
 "username": "gua",
 "password": "pwd",
 "id": 1
 },
 {
 "username": "newgua",
 "password": "123",
 "id": 2
 }
 ]
 */
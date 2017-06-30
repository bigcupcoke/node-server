const net = require('net')
const fs = require('fs')
const { log } = require('./utils')
const Request = require('./request.js')
const routeIndex = require('./routes/index')

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 20 OK\r\n\r\n<h1>404 NOT FOUND</h1>'
    }
    const r = e[code] || ''
    return r
}

// 生成响应
const responseFor = (raw, request) => {
    const route = {}
    const routes = Object.assign(route, routeIndex)
    const response = routes[request.path] || error
    const resp = response(request)
    return resp
}

// 处理请求
const processRequest = (raw, socket) => {
    const r = raw.toString()
    const request = new Request(r)
    const response = responseFor(raw, request)
    socket.write(response)
    socket.destroy()
}

// 把逻辑放在单独的函数中, 这样可以方便地调用
// run 函数是一套完整的后端server, 启服务， 接数据，处理数据，发送响应
const run = (host='', port=4000) => {
    // 建立服务器
    const server = new net.Server()

    // 开启服务器的监听
    server.listen(port, host, () =>{
        const address = server.address()
        log(`listening at http://${address.address}:${address.port}`)
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            processRequest(data, s)
        })
    })
}

const __main = () => {
    run('127.0.0.1')
}

if (require.main === module) {
    __main()
}
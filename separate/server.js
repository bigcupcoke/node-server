const http = require('http')
const https = require('https')

const express = require('express')
// 引入 url 模块解析 url
const url = require('url')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

const app = express()

// 配置 bodyParser
app.use(bodyParser.json())
// 配置静态资源文件, 比如 js css 图片
const asset = __dirname + '/static'
app.use('/static', express.static(asset))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

const log = console.log.bind(console)

const clientByProtocol = (protocol) => {
    if (protocol === 'http:') {
        return http
    } else {
        return https
    }
}

// 配置基本的请求参数
const apiOptions = () => {
    // 从环境变量里获取 apiServer 的值, 尽管这个做法不太好
    const envServer = process.env.apiServer
    // 设置默认 api 服务器地址
    const defaultServer = 'http://127.0.0.1:3000'
    const server = envServer || defaultServer
    // 解析 url 之后的结果
    const result = url.parse(server)
    // 提前设置好这部分
    const obj = {
        headers: {
            'Content-Type': 'application/json',
        },
        // https 相关的设置, 一个固定套路而已， 具体用法以后用到在去查
        rejectUnauthorized: false,
    }
    const options = Object.assign({}, obj, result)

    if (options.href.length > 0) {
        delete options.href
    }
    return options
}

// 配置 api 请求参数
const httpOptions = (request) => {
    // 先获取基本的 api options 设置
    const baseOptions = apiOptions()
    // 设置请求的 path
    log(request.originalUrl, 'url originalUrl')
    const pathOptions = {
        path: request.originalUrl,
    }
    const options = Object.assign({}, baseOptions, pathOptions)
    // 把浏览器发送的请求的 headers 全部添加到 options 中,
    Object.keys(request.headers).forEach((k) => {
        options.headers[k] = request.headers[k]
    })
    // 设置请求的方法
    options.method = request.method
    return options
}

app.get('/', (request, response) => {
    response.render('index.html')
})

// 只转发 api 请求,
app.all('/api/*', (request, response) => {
    // log('request raw', request)
    const options = httpOptions(request)
    // log('request options', options)
    const client = clientByProtocol(options.protocol)
    const r = client.request(options, (res) => {
        // res.statusCode 是 api server 返回的状态码
        // 保持 express response 的状态码和 api server 的状态码一致
        // 避免出现返回 304, 导致 response 出错
        response.status(res.statusCode)
        log('debug res', res.headers, res.statusCode)
        // 回调里的 res 是 api server 返回的响应
        // 将响应的 headers 原样设置到 response(这个是 express 的 response) 中
        Object.keys(res.headers).forEach((k) => {
            const v = res.headers[k]
            response.setHeader(k, v)
        })

        // 接收 api server 的响应时, 会触发 data 事件
        res.on('data', (data) => {
            // write 是 http 对象的方法, 其实就是 socket.wirte的封装
            log('debug data', data.toString('utf8'))
            response.write(data)
        })

        // api server 的数据接收完成后, 会触发 end 事件
        res.on('end', () => {
            log('debug end')
            // api server 发送完数据之后, express 也告诉客户端发送完数据
            response.end()
        })

        // 响应发送错误
        res.on('error', () => {
            console.error(`error to request: ${request.url}`)
        })
    })

    // 发往 api server 的请求遇到问题
    r.on('error', (error) => {
        console.error(` *** 请求 api server error: ${request.url}`, error)
    })

    log('debug options method', options.method)

    if (options.method !== 'GET') {
        // request.body 是浏览器发送过来的数据,
        // 如果不是 GET 方法, 说明 request.body 有内容,
        // 转成 到 api server
        const body = JSON.stringify(request.body)
        log('debug body', body, typeof body)
        // 把 body 里的数据发送到 api server
        r.write(body)
    }

    // 求就是 socket.destroy()
    r.end()
})

const run = (port=3000, host='') => {
    // 其实也不过是在 socket 上进行封装而已
    // app.listen 方法返回一个 http.Server 对象, 这样使用更方便
    const server = app.listen(port, host, () => {
        // 非常熟悉的方法
        const address = server.address()
        host = address.address
        port = address.port
        log(`server started at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 3300
    const host = '127.0.0.1'
    run(port, host)
}

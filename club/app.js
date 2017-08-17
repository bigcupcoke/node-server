const express = require('express')
const nunjucks = require('nunjucks')
const bodyPareser = require('body-parser')

const { log } = require('./utils')
const fs = require('fs')

const app = express()

app.use(bodyPareser.urlencoded({
    extended: true,
}))

nunjucks.configure('templates', {
    autoescape: true,
    express: app,
})

const messageList = []

app.get('/', (request, response) => {
    response.send('hello dake')
})

app.get('/message', (request, response) => {

    log('请求方法', request.method)
    log('request, query 参数', request.query)
    log('request, body 参数', request.body)
    response.render('message_index.html', {
        messages: messageList,
    })
})

app.post('/message/add', (request, response) => {

    // 默认是 undefined
    // 需要安装 bodyParser 或者其他中间件才能获取正确的数据
    log('request, POST 的 form 表单数据', request.body)
    const msg = {
        content: request.body.msg_post || '',
    }
    messageList.push(msg)
    response.redirect('/message')
})

const run = (port=3000, host='127.0.0.1') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    run()
}
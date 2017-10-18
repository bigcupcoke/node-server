const express = require('express')
const nunjucks = require('nunjucks')
const bodyPareser = require('body-parser')
const session = require('cookie-session')

const { log } = require('./utils')
const { secretKey } = require('./config')

const fs = require('fs')

const app = express()

app.use(bodyPareser.urlencoded({
    extended: true,
}))

app.use(session({
    secret: secretKey,
}))

nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

// 设置跨域
// const cors = require('cors')
// app.use(cors())


// 引入路由
const todo = require('./routes/todo')
const index = require('./routes/index')
const topic = require('./routes/t')
const reply = require('./routes/r')
const apiTopic = require('./api/topic')
const questionNaire = require('./routes/questionnaire')
const apiQs = require('./api/questionnaire')
// static 资源
const asset = __dirname + '/static'

app.use('/static', express.static(asset))
app.use('/', index)
app.use('/todo', todo)
app.use('/topic', topic)
app.use('/reply', reply)
app.use('/api/topic', apiTopic)
app.use('/qs', questionNaire)
app.use('/api/qs', apiQs)
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
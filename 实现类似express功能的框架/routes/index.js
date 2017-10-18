const fs = require('fs')
const { log } = require('../utils.js')
const {
    currentUser,
    template,
    httpResponse,
    headerFromMapper,
} = require('./main.js')

const session = require('../models/session')

const index = (request) => {
    log('requset in index', request)
    const u = currentUser(request)
    const username = u ? u.username : ''
    let body = template('index.html', {
        username: username,
    })
    return httpResponse(body)
}

const favicon = (request) => {
    const filename = 'favicon.ico'
    const path = `../static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper(mapper)
    const h = Buffer.form(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const exe = (request) => {
    const filename = 'Setup.exe'
    const path = `./static/${filename}`
    const body = fs.readFileSync(path)
    log(body, 'body')
    const mapper = {
        'Content-type': 'application/octet-stream',
    }
    const header = headerFromMapper(mapper)
    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const routeIndex = {
    '/': index,
    '/exe': exe,
    // '/favicon.ico': favicon,
}

module.exports = routeIndex
const fs = require('fs')
const { log } = require('../utils.js')
const {
    currentUser,
    template,
    httpResponse,
} = require('./main.js')

const session = require('../models/session')

const index = (request) => {
    // log('requset in index', request)
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
    const header = headerFromMapper()
    const h = Buffer.form(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const routeIndex = {
    '/': index,
}

module.exports = routeIndex
const fs = require('fs')
const { log } = require('../utils.js')
const {
    session,
    currentUser,
    template,
    headerFromMapper,
} = require('./main.js')

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header  = headerFromMapper(headers)
    const u = currentUser(request)
    const username = u ? u.username : ''
    let body = template('index.html', {
        username: username,
    })
    const r = header + '\r\n' + body
    log(`r\r\n${r}`)
    return r
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
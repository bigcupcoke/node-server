const fs = require('fs')

// 格式化时间的函数
const formattedTime = () => {
    const d = new Date()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    let seconds = d.getSeconds()
    if (seconds < 10) {
        seconds = '0' + String(seconds)
    }
    const t = `${hours}:${minutes}:${seconds}`
    return t
}

const log = (...args) => {
    const t = formattedTime()
    const arg = [t].concat(args)
    console.log.apply(console, arg)
    const s = JSON.stringify(args, null, 2)
    const content = t + ' ' + s + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a',
    })
}

const randomStr = () => {
    const seed = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * (seed.length - 1)
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

const error = (request=null, code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
    return r
}

const key = 'dake123'

module.exports = {
    log,
    randomStr,
    error,
    key,
}



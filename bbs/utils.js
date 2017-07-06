const fs = require('fs')

// 格式化时间的函数
const formattedTime = () => {
    const d = new Date()
    // 这里需要注意, js 中 month 是从 0 开始计算的, 所以要加 1
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
    // 把时间和需要 log 的内容拼接在一起, 这样就知道什么时候发生了什么
    const arg = [t].concat(args)
    console.log.apply(console, arg)

    // 将 log 的内容写入到一个文件中, 可以持久化存储 log, 也就是打日志
    // flag: 'a' 是追加模式, 每次都会把内容写进去, 并且不会覆盖
    fs.writeFileSync('log.txt', args, {
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

module.exports = {
    log,
    randomStr,
}



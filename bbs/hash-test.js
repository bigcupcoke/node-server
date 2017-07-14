var { log } = require('./utils')
var crypto = require('crypto')

// 常用hash算法是 md5, sha1, 区别是一个生成32位字符，一个是40位

var testMd5 = function(s) {
    // 选择 md5 摘要算法
    var algorithm = 'md5'

    // 创建 hash 对象
    var hash = crypto.createHash(algorithm)
    log('hash', hash)
    // 更新 hash 对象
    hash.update(s)
    log('hash update', hash)
    // log md5 摘要信息, 这里是 97902695fe1b5f52d0f920dc203dec9f
    log('md5 摘要', hash.digest('hex'))
}

var testSha1 = function(s) {
    // 选择 sha1 摘要算法
    var algorithm = 'sha1'

    // 创建 hash 对象
    var hash = crypto.createHash(algorithm)

    // 更新 hash 对象
    hash.update(s)
    // log sha1 摘要信息, 这里是 6cc965fb5d3b3ffab629405eea80ebe620cfa00a
    console.log('sha1 摘要', hash.digest('hex'))
}

function saltedPassword(password, salt='') {
    function _md5hex(s) {
        var hash = crypto.createHash('md5')
        hash.update(s)
        var h = hash.digest('hex')
        return h
    }

    var hash1 = _md5hex(password)
    var hash2 = _md5hex(hash1 + salt)
    log('hashed password', hash1, hash2)
    return hash2
}

var testSalt = function() {
    saltedPassword('12345', '')
    saltedPassword('12345', 'abc')
}

var testRaw = function() {
    function hashedPassword(password) {
        var hash = crypto.createHash('md5')
        hash.update(password)
        var pwd = hash.digest('hex')
        return pwd
    }

    console.time('find password')
    // 原始 1234
    const pwd = '81dc9bdb52d04dc20036dbd8313ed055'

    for (var i = 0; i < 10000; i++) {
        var s = String(i)
        var password = hashedPassword(s)
        log('s', s, password)
        if (password === pwd) {
            log('原始密码是', s)
            break
        }
    }
    console.timeEnd('find password')
}

var testEncrypt = function(s, key) {
    var algorithm = 'aes-256-cbc'
    var cipher = crypto.createCipher(algorithm, key)
    var c = cipher.update(s, 'utf8', 'hex')
    c += cipher.final('hex')
    log('加密后的信息', c)
    return c
}

var testDecrypt = function(c, key) {
    var algorithm = 'aes-256-cbc'
    var decipher = crypto.createDecipher(algorithm, key)
    var d = decipher.update(c, 'hex', 'utf8')
    d += decipher.final('utf8')
    log('原始信息', d)
}

var test = function() {
    // 要加密的是 'dake'
    // var s = 'dake'
    // testMd5(s)
    // testSha1(s)
    // testSalt()
    // testRaw()
    // var key = 'dake123'
    // var c = testEncrypt(s, key)
    // testDecrypt(c, key)
    var hashes = crypto.getHashes()
    var ciphers = crypto.getCiphers()
    log('hashes and ciphers method', hashes, ciphers)
}

test()
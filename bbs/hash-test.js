var crypto = require('crypto')
console.log('crypto', crypto)
var mapper = {
    'dake': 'c9c1ebed56b2efee7844b4158905d845',
    '1234': '81dc9bdb52d04dc20036dbd8313ed055',
}

var testMd5 = function(s) {
    // 选择 md5 摘要算法
    var algorithm = 'md5'

    // 创建 hash 对象
    var hash = crypto.createHash(algorithm)

    // 更新 hash 对象
    hash.update(s)
    // log md5 摘要信息, 这里是 c9c1ebed56b2efee7844b4158905d845
    console.log('md5 摘要', hash.digest('hex'))
}

var testSha1 = function(s) {
    // 选择 sha1 摘要算法
    var algorithm = 'sha1'

    // 创建 hash 对象
    var hash = crypto.createHash(algorithm)

    // 更新 hash 对象
    hash.update(s)
    // log sha1 摘要信息, 这里是 4843c628d74aa10769eb21b832f00a778db8b17e
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
    console.log('hashed password', hash1, hash2)
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
    const pwd = '81dc9bdb52d04dc20036dbd8313ed055'

    for (var i = 0; i < 10000; i++) {
        var s = String(i)
        var password = hashedPassword(s)
        if (password === pwd) {
            console.log('原始密码是', s)
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
    console.log('加密后的信息', c)
    return c
}

var testDecrypt = function(c, key) {
    var algorithm = 'aes-256-cbc'
    var decipher = crypto.createDecipher(algorithm, key)
    var d = decipher.update(c, 'hex', 'utf8')
    d += decipher.final('utf8')
    console.log('原始信息', d)
}

var test = function() {
    // 要加密的是 'gua'
    var s = 'dake'
    // testMd5(s)
    // testSha1(s)
    // testSalt()
    var key = 'dake123'
    var c = testEncrypt(s, key)
    testDecrypt(c, key)
    var hashes = crypto.getHashes()
    var ciphers = crypto.getCiphers()
    console.log('hashes and ciphers method', hashes, ciphers)
}

test()

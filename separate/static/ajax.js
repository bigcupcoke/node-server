// 定义 ajax函数
var ajax = (method, path, data, callback) => {
    // 拿到 xhr对象
    var xhr = new XMLHttpRequest()
    // 端口不一样，会要求跨域
    // node server 是 3000 port
    var host = 'http://127.0.0.1:3300'
    path = host + path
    xhr.open(method, path, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.response)
        }
    }
    xhr.send(data)
}

var fetch = (url, callback) => {
    ajax('GET', url, '', function(r) {
        console.log('res', r, r.length)
        // var data = JSON.parse(r)
        var data = r
        callback(data)
    })
}

var create = (url, form, callback) => {
    var data = JSON.stringify(form)
    ajax('POST', url, data, function(r) {
        console.log('response', r, r.length)
        var data = JSON.parse(r)
        callback(data)
    })
}

class Request {
    constructor(raw) {
        const { method, path, query, headers, body } = this._parsedRaw(raw)
        this.raw = raw
        // 默认是 GET 方法
        this.method = method
        this.path = path
        // query 默认是一个 object, 这样使用会更加方便
        this.query = query
        this.body = body
        this.headers = {}
        this.cookies = {}
        this.addHeaders(headers)
    }

    addCookies() {
        //
        const cookies = this.headers.Cookie || ''
        const pairs = cookies.split('; ')
        pairs.forEach((pair) => {
            if (pair.includes('=')) {
                const [k, v] = pair.split('=')
                this.cookies[k] = v
            }
        })
    }

    addHeaders(headers) {
        const lines = headers
        lines.forEach((line) => {
            const [k, v] = line.split(': ')
            this.headers[k] = v
        })
        this.addCookies()
    }

    form() {
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        for (let pair of pairs) {
            const [k, v] = pair.split('=')
            d[k] = v
        }
        return d
    }

    _parsedPath(path) {
        // 先判断 path 中是否包含 ?
        const index = path.indexOf('?')
        // 如果不包含 ?, query 是一个空对象
        if (index === -1) {
            return {
                path: path,
                query: {},
            }
        } else {
            // 如果包含 ?, 则按照 ? 将请求中的 path 分成 path 和 query
            const l = path.split('?')
            path = l[0]

            // 下面这部分的作用是解析 query
            // query 的格式为 a=b&c=d&e=f
            const search = l[1]
            const args = search.split('&')
            const query = {}
            for (let arg of args) {
                const [k, v] = arg.split('=')
                query[k] = v
            }
            return {
                path: path,
                query: query,
            }
        }
    }

    _parsedRaw(raw) {
        const r = raw
        const line = r.split(' ')
        const [method, url] = line
        const { path, query } = this._parsedPath(url)
        const message = r.split('\r\n\r\n')
        const headers = message[0].split('\r\n').slice(1)
        const body = message[1]

        return {
            method: method,
            path: path,
            query: query,
            headers: headers,
            body: body,
        }
    }
}

module.exports = Request


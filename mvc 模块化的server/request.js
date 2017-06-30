const { log } = require('../utils')

class Request {
    // new 的时候执行
    constructor(raw) {
        // 解析 raw 原始信息
        const { method, path, query, headers, body } = this._parsedRaw(raw)
        this.method = method
        this.path = path
        this.bdoy = body
        this.headers = {}
        this.cookies = {}
        this.addHeaders(headers)
    }

    // 添加 cookies 的方法
    addCookies() {
        const cookies = this.headers.Cookie || ''
        const pairs = cookies.split('; ')
        // log('cookies', cookies)
        pairs.forEach((pair) => {
            let [k, v] = pair.split('=')
            this.cookies[k] = v
        })
    }

    // 添加 headers 的方法
    addHeaders(headers) {
        // log('headers', headers)
        const lines = headers.split('\r\n')
        lines.forEach((line) => {
            let [k, v] = line.split(': ')
            this.headers[k] = v
        })
        this.addCookies()
    }

    // 解析路径。 返回的是一个包含path 和 query 的对象
    _parsePathname(pathname) {
        const index = pathname.indexOf('?')
        if (index === -1) {
            return {
                path: pathname,
                query: {},
            }
        } else {
            let [path, search] = pathname.split('?')
            const args = search.split('&')
            let query = {}
            args.forEach((a) => {
                const [k, v] = a.split('=')
                query[k] = v
            })
            return {
                path: path,
                query: query,
            }
        }
    }

    // 返回解析后的raw, 全是字符串
    _parsedRaw(raw) {
        const r = raw
        // log('r', r)
        const [method, pathname] = r.split(' ')
        const { path, query } = this._parsePathname(pathname)
        const raws = r.split('\r\n\r\n')
        const headers = raws[0].split('\r\n')[1]
        // log('raws', raws)
        const body = raws[1]

        return {
            method,
            path,
            query,
            headers,
            body,
        }
    }

    // 解析 body 字符串, 返回 query 对象
    form() {
        const body = decodeURIComponent(this.body)
        const args = body.split('&')
        const result = {}
        args.forEach((a) => {
            const [k, v] = a.split('=')
            result[k] = v
        })
        return result
    }
}

module.exports = Request


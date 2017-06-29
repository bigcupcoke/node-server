
class Request {
    constructor() {
        this.headers = {}
        this.method = 'GET'
        this.path = ''
        this.body = ''
        this.query = {}
        this.cookies = {}
    }

    form() {
        let body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        pairs.forEach((item) => {
            let [k, v] = item.split('=')
            this.query[k] = v
        })
        return this.query
    }

    addCookies() {
        const cookies = this.headers.Cookie || ''
        const pairs = cookies.split('; ')
        // [
        //     'user=vn7hawwfsjkjc7fk',
        //     'max-age=1000',
        //     'valid=false',
        // ]
        pairs.forEach((item) => {
            let [k, v] = item.split('=')
            this.cookies[k] = v
        })
    }

    addHeaders(headers) {
        headers.forEach((header) => {
            let [k, v] = header.split(': ')
            this.headers[k] = v
        })
        this.addCookies()
    }
}

module.exports = Request

// let s = [
//     {id: 1, name: 3, jod: 123}
//     {id: 4, name: 4, jod: 123}
//     {id: 7, name: 7, jod: 123}
// ]
// let t =  [4, 7, 1]
// 根据id 来排序

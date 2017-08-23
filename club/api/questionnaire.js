const express = require('express')

const { log } = require('../utils')
const jsonResponse = require('./main')

const fs = require('fs')

const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

const load = (path) => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

const router = express.Router()

router.get('/all', (req, resp) => {
    const d = load('./db/qs.txt')
    const dict = {
        success: true,
        data: d,
        message: ''
    }
    jsonResponse(req, resp, dict)
})

router.post('/add', (req, resp) => {
    const form = req.body
    log(form,  'from')
    save(form, './db/qs.txt')
    const dict = {
        success: true,
        data: '',
        message: ''
    }
    jsonResponse(req, resp, dict)
})

module.exports = router
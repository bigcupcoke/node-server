const express = require('express')

const { log } = require('../utils')

const router = express.Router()

router.get('/', (request, response) => {
    response.render('questionnaire/questionnaire.html')
})

router.get('/list', (request, response) => {
    response.render('questionnaire/list.html')
})

router.post('/', (request, response) => {
    response.render('questionnaire/questionnaire.html')
})

module.exports = router
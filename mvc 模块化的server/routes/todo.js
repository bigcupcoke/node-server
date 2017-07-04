const fs = require('fs')
const { log, randomStr } = require('../../utils.js')
const {
    session,
    currentUser,
    template,
    headerFromMapper,
    loginRequired,
    redirect,
} = require('./main.js')

const Todo = require('../models/todo')
const User = require('../models/user')

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const u = currentUser(request)
    const models = Todo.find('user_id', u.id)
    const todos = models.map((m) => {
        const t = `
            <div>
                ${m.title}
                <a href="/todo/edit?id=${m.id}">编辑</a>
                <a href="/todo/delete?id=${m.id}">删除</a>
            </div>
        `
    }).join('')
    let body = template('todo_index.html')
    body = body.replace('{{todos}}', todos)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    log('r', r)
    return r
}

const routeTodos = {
    '/todo':　loginRequired(index),
}

// log('routeTodos', loginRequired(index), loginRequired)
module.exports = routeTodos
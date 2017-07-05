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

const formattedTime = (ts) => {
    const d = new Date(ts)
    // 这里需要注意, js 中 month 是从 0 开始计算的, 所以要加 1
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()

    const t = `${hours}:${minutes}:${seconds}`
    return t
}

// todo 页面
const index = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const u = currentUser(request)
    const models = Todo.find('user_id', u.id)
    // log('u', u)
    // log('models', models)
    const todos = models.map((m) => {
        const createdTime = formattedTime(m.created_time)
        const updatedTime = formattedTime(m.updated_time)
        const t = `
            <div>
                ${m.title}
                <a href="/todo/edit?id=${m.id}">编辑</a>
                <a href="/todo/delete?id=${m.id}">删除</a>
                <span>ct: ${createdTime}</span>
                <span>ut: ${updatedTime}</span>
            </div>
        `
        return t
    }).join('')
    // log('todos debug', todos)
    let body = template('todo_index.html')
    body = body.replace('{{todos}}', todos)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    // log('r', r)
    return r
}

// 增加一个 todo
const add = (request) => {
    if (request.method = "POST") {
        const form = request.form()
        const u = currentUser(request)
        form.user_id = u.id
        const t = Todo.create(form)
        log('t', t, 'form', form)
        t.save()
        // log('t', t)
    }
    return redirect('/todo')
}

// 编辑todo
const edit = (request) => {
    const id = request.query.id
    // log('debug todo', request.query)
    const todo = Todo.get(id)
    // log('debug todo', todo)
    let body = template('todo_edit.html')
    body = body.replace('{{todo_id}}', todo.id)
    body = body.replace('{{todo_title}}', todo.title)
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

// 更新todo
const update = (request) => {
    if (request.method === "POST") {
        const form = request.form()
        //这里把 update 作为 Todo类的静态方法更好
        Todo.update(form)
    }
    return redirect('/todo')
}

// 删除一个todo
const del = (request) => {
    const id = request.query.id
    Todo.remove(id)
    return redirect('/todo')
}

// 路由表
const routeTodos = {
    '/todo':　loginRequired(index),
    '/todo/add': add,
    '/todo/edit': edit,
    '/todo/update': update,
    '/todo/delete': del,
}

module.exports = routeTodos

`
INSERT INTO
    users (id, username, password, email)
VALUES 
    (2, '', '', NULL);

UPDATE users SET username=? WHERE _rowid_='2';
UPDATE users SET password=? WHERE _rowid_='2';
UPDATE users SET email=? WHERE _rowid_='2';
`

// 引入 nodejs 的 sqlite3 模块,
// nodejs 有不少 sqlite3 模块
const Database = require('better-sqlite3')

// 如果数据库文件存在则直接创建连接
const db = new Database('node8.db')

// 自定义 log 函数, 方便使用
const log = console.log.bind(console)

/*
 CREATE TABLE `users`
 ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `username` TEXT NOT NULL UNIQUE, `password` TEXT NOT NULL, `email` TEXT NOT NULL )
 */

// 创建表的函数
function create() {
    // 创建表的 sql 语句
    const sqlCreate = `
    CREATE TABLE users (
        id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        username	TEXT NOT NULL UNIQUE,
        password	TEXT NOT NULL,
        email	TEXT
    )
    `
    // db.prepare 会根据传的 sql 语句创建一个 Statement 对象, 这个对象可以用来执行 sql 语句
    const statement = db.prepare(sqlCreate)
    // 执行 sqlCreate 语句
    const info = statement.run()
    log('创建成功', info)
}

/*
 INSERT INTO `users`(`id`,`username`,`password`,`email`) VALUES (1,'','','');
 UPDATE `users` SET `username`=? WHERE `_rowid_`='1';
 UPDATE `users` SET `password`=? WHERE `_rowid_`='1';
 UPDATE `users` SET `email`=? WHERE `_rowid_`='1';
 */

// 往表里面增加数据的函数
function insert(username, password, email) {
    // 插入数据的 sql 语句
    const sqlInsert = `
    INSERT INTO
        users(username, password, email)
    VALUES
        (?, ?, ?)
    `
    // 创建 Statement 对象
    const statement = db.prepare(sqlInsert)
    const args = [username, password, email]
    // insert 语句需要参数, 将参数放在 array 中, 然后调用 run 的时候传过去
    // statement.run 的返回值 info 是一个对象
    // info.changes 表示这次操作（插入数据、更新数据、删除数据）一共改变了多少行
    const info = statement.run(args)

    // run 除了接收 array 作为参数, 也可以直接拆开一个一个传
    // statement.run(username, password, email)
    log('插入数据成功', info)
}

// 查询数据的函数
function select() {
    // sql 注入, 非常严重的安全漏洞

    // 查询数据库的 sql 语句
    const sqlQuery = `
    SELECT
        *
    FROM
        users
    `
    // 创建 Statement 对象
    const statement = db.prepare(sqlQuery)
    // get 方法返回一条数据
    // 如果查找出来的有多条, 只返回第一条
    const row = statement.get()

    // all 方法返回多条数据
    const rows = statement.all()
    log(row, rows)
}

// 删除数据的函数
function del(userId) {
    // 删除数据的 sql 语句
    const sqlDelete = `
    DELETE FROM
        users
    WHERE
        id=?
    `
    const statement = db.prepare(sqlDelete)
    // 传入 userId
    statement.run(userId)

    // db.prepare(sqlDelete).run(userId)
    log('删除成功')
}

// 更新数据的函数
function update(userId, email) {
    // 更新数据的 sql 语句
    const sqlUpdate = `
    UPDATE
        users
    SET
        email=?
    WHERE
        id=?
    `
    const statement = db.prepare(sqlUpdate)
    // 传入 email 和 userId 两个参数
    statement.run(email, userId)
    log('更新成功')
}

const testCreate = () => {
    create()
}

const testInsert = () => {
    insert('gua4', '12345', '12345@qq.com')
}

const testSelect = () => {
    select()
}

const testDelete = () => {
    del(1)
}

const testUpdate = () => {
    update(3, 'gua@gualab.cc')
}

const test = () => {
    // testCreate()
    // testInsert()
    testSelect()
    // testDelete()
    // testUpdate()

    // db 这个连接有一些属性
    // db.open 表示数据库是否打开
    // db.name 表示当前连接的数据库的名称
    console.log(db.open, db.name)

    // 关闭数据库, 打开数据库之后需要关闭
    db.close()
}

if (require.main === module) {
    test()
}


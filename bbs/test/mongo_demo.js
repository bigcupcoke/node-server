
const { MongoClient } = require('mongodb')

// mongo 数据库的地址, 主机是本机, 端口是默认的端口, node 是数据库的名称
const mongoUrl = () => {
    const url = 'mongodb://localhost:27017/node'
    return url
}

const connect = () => {
    // 连接 mongodb 数据库
    const url = mongoUrl()
    MongoClient.connect(url, (error, db) => {
        console.log('Connected successfully to server')

        insertDocuments(db, () => {
            db.close()
        })

        // find(db, () => {
        //     db.close()
        // })

        // update(db, () => {
        //     db.close()
        // })

        remove(db, () => {
            db.close()
        })
    })
}

// 插入数据
// ===
// mongo 中的 document 相当于 sqlite 中的 table
// 不需要定义，直接使用
// 不限定每条数据的字段
// 直接插入新数据，数据以 object 字典的形式提供
// 下面的例子中， user 是文档名（表名），不存在的文档会自动创建
// 每个数据有一个自动创建的字段 _id，可以认为是 mongo 自动创建的主键

// 返回一个 a b 之间的随机整数
const randint = (a, b) => {
    const r = Math.random()
    const n = r * (b - a) + a
    const i = Math.floor(n)
    return i
}

const insertDocuments = (db, callback) => {
    // 这里使用的是 test_todo 这个 document
    const collection = db.collection('test_todo')
    const d = [
        {
            content: '吃饭',
            user_id: 1,
            username: 'gua',
        },
        {
            content: '喝水',
            user_id: 2,
            username: 'dake123',
        },
        {
            content: '睡觉',
            done: true,
            username: 'gua2',
        },
    ]

    // 放一个随机值来方便区分不同的数据以便下面的代码使用条件查询
    d.forEach((e) => {
        e.random = randint(1, 20)
    })

    // console.log('debug', d)

    // insertMany 是一次插入多条记录
    collection.insertMany(d, (error, result) => {
        console.log('inserted 3 documents into the collection')
        callback(result)
    })


    const t1 = {
        content: '玩游戏',
    }
    collection.insertOne(t1, (error, result) => {
        console.log('insert 1 document into the collection')
        callback(result)
    })


    //insert 方法已经废弃, 使用 insertOne 或者 insertMany 方法来插入数据

    // const t2 = {
    //     content: '聊天',
    //     done: false,
    // }
    // collection.insert(t2, (error, result) => {
    //     console.log('使用 insert 方法')
    //     callback(result)
    // })
}

const find = (db, callback) => {
    const collection = db.collection('test_todo')

    // find 查询的结果是一个 cursor 实例
    // toArray 方法将结果转换成数组, 可以直接使用
    // collection.find({}).toArray((error, result) => {
    //     console.log('error', error)
    //     console.log('result', result.length, result)
    // })

    // 查找 随机值 为 14 的所有数据
    // const query1 = {
    //     random: 14,
    // }
    // collection.find(query1).toArray((error, result) => {
    //     console.log('random 14', result)
    // })

    // 查找 随机值 大于 10 的所有数据
    // const query2 = {
    //     'random': {
    //         $gt: 10
    //     }
    // }
    // collection.find(query2).toArray((error, result) => {
    //     console.log('random > 15', result)
    // })

    // 查找 content 为 喝水 的所有数据
    // const query3 = {
    //     content: '喝水',
    // }
    // find(key, value)
    //
    // find({
    //     key: value
    // })
    // collection.find(query3).toArray((error, result) => {
    //     console.log('content 喝水', result)
    // })

    // $or 查询
    // const query4 = {
    //     '$or': [
    //         {
    //             random: 14,
    //         },
    //         {
    //             content: '喝水',
    //         },
    //     ]
    // }
    // collection.find(query4).toArray((error, result) => {
    //     console.log('random == 12 or content 为吃饭', result)
    // })

    // 还有 $lt $let $get $ne $or 等条件


    // 部分字段查询, 相当于 select xx, yy from table where abc
    const query5 = {
        username: 'dake123',
    }
    // 只查询某几个字段, 比如只查询 content 和 username 这两个字段
    // 将 content 和 username 设置为 1
    // 这样查询出来的结果会带上 content 和 username, 并且会默认带上 _id 这个字段
    // const field = {
    //     content: 1,
    //     username: 1,
    // }

    // 如果不想查询出某些字段, 可以将这些字段的值位置为 0
    // 比如不想查询 _id 这个字段
    const field = {
        content: 1,
        random: 1,
        _id: 0,
    }
    // collection.find(query5, field).toArray((error, result) => {
    //     console.log('usernamewith field', result)
    // })

    const query6 = {
        username: 'dake123',
    }

    // findOne 方法返回一条数据
    // 如果查询的结果是多条数据的数组, 那么最后返回的是数组的第一个条目
    collection.findOne(query6, (error, result) => {
        console.log('find one username gua with field', result)
    })

    callback()
}

const update = (db, callback) => {
    const collection = db.collection('test_todo')

    const query = {
        content: '喝水',
    }

    const form = {
        $set: {
            random: 111,
        }
    }

    // update 方法已经废弃, 使用 updateOne 和 updateMany 方法更新数据
    // updateOne 更新查询出来的第一条数据
    // collection.updateOne(query, form, () => {
    //     collection.find(query1).toArray((error, result) => {
    //         console.log('query result after update one', result)
    //     })
    // })

    // updateMany 更新查询出来的所有数据
    const query1 = {
        content: '吃饭',
    }

    // 更新的时候不仅可以改变现有字段的值
    // 也可以直接添加一个字段并且赋值
    const form1 = {
        $set: {
            updated_time: Date.now()
        }
    }

    // collection.updateMany(query1, form1, (error, result) => {
    //     collection.find(query1).toArray((error, result) => {
    //         console.log('query result after update many', result)
    //     })
    // })

    // 如果要在 updateOne 或者 updateMany 之后查询修改之后的结果
    // 就不应该提前关闭数据库
    // callback()
}

const remove = (db, callback) => {
    const collection = db.collection('test_todo')

    const query = {
        random: 14,
    }

    // collection.find(query).toArray((error, result) => {
    //     console.log('query random 3', result)
    // })
    //
    // collection.deleteOne(query, (error, result) => {
    //     collection.find(query).toArray((error, result) => {
    //         console.log('query random 3 after delete', result)
    //     })
    // })

    // deleteMany 是一次删除所有查询到的数据
}

const test = () => {
    connect()
}

if (require.main === module) {
    test()
}
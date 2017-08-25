window.log = console.log.bind(console, '*** debug');

var config = {
    url: {
        all: 'http://127.0.0.1:3000/api/qs/all',
        add: 'http://127.0.0.1:3000/api/qs/add',
        list: 'http://127.0.0.1:3000/api/qs/list',
    },

    default: {
        choice: {
            content: "",
            counts: 6,
        },

        que: {
            isChoice: '',
            choice: [
                {
                    "content": "",
                },
                {
                    "content": "",
                },
            ],
        },
    },
}

var a = [
    {
    title: 'dasdasdad',
    ct: '2018-7-9',
    state: '发布了',
    id: 100,
    counts: 100
},
    {
    title: 'dasdasdad',
    ct: '2018-7-9',
    state: '发布了',
    id: 100,
    counts: 100
},
    {
    title: 'dasdasdad',
    ct: '2018-7-9',
    state: '发布了',
    id: 100,
    counts: 100
},
    {
    title: 'dasdasdad',
    ct: '2018-7-9',
    state: '发布了',
    id: 100,
    counts: 100
},
]

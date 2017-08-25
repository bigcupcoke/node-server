
//  类 ： 问题
var Que = function() {
    this.init()
}

Que.create = function() {
    var instance =  new this();
    return instance;
}

Que.prototype = {
    constructor: Que,

    init: function() {
        log('init  que ok')
        this.bindEvents();
    },

    //  添加一个问题
    add: function(type) {
        var _t = this;
        $('.question-tool').on('click', 'button', function() {
            log('click add')
            var s = $(this);
            var type = s.data('type');
            var que = config.default.que;
            que.isChoice = type;
            var order = $('.question').length;
            var t = _t.template(que, order);
            $('main').append(t);
        })
    },

    //  移除问题
    remove: function() {
        var _t = this;
        $('body').on('click', '.que-remove', function() {
            log('click remove')
            var s = $(this);
            var que = s.closest('.question');
            var index = que.index();
            var order = index + 1;
            que.remove();
            _t.changeOrder(index);
            // log(order, 'index removed')
        })
    },

    //  绑定事件
    bindEvents: function() {
        this.add();
        this.remove();
    },

    //  每题对应的序号， ＝下标 index+１
    order: function() {
        var len = $('.question').length;
        var order = -1
        if (len > 0) {
            order = len + 1;
        } else {
            order = 1;
        }
        return order;
    },

    //  从 起始序号的那个问题开始，跟着改变后面所有问题的序号
    changeOrder: function(start) {
        var queAll = $('.question');
        var s = start;
        var qs = $(queAll.slice(s));
        // log(qs, 'qs')
        for (var i = 0; i < qs.length; i++) {
            var e = $(qs[i]);
            // log(e, 'e in for');
            var iTag = e.find('i');
            var order = Number(iTag.text());
            // log(i, 'i now remove')
            iTag.text(order - 1);
        }
    },

    //  任意一个问题的 html 模板
    template: function(queInfo, index) {
        var q = queInfo;
        // log(q, 'qqqq')
        var o = {};
        //  下标
        o.i = index;
        //  问题类型
        o.type = q.isChoice;
        //  题目的标题描述
        o.describe = q.subject;
        //  题目的选项
        o.options = q.choice;
        //  题目的序号
        o.order = index + 1;
        // log('sdasd', o.type)
        var _t = this;
        var templateAll = {
            //  单选
            "0": _t.templateByChoice,
            //  多选
            "1": _t.templateByChoice,
            //  问答题
            "2": _t.templateByEssay,
        }
        return templateAll[o.type](o);
    },

    //  选择题的 html 模板
    templateByChoice: function(optionsInfo) {
        var o = optionsInfo;
        log('*** o', o)
        //  type对应中文
        var typeChinese = {
            0: '单选题',
            1: '多选题',
        };

        var v = o.describe || '';
        // 这个是一个问题下所有的选项信息
        var ops = o.options;

        var templatedOption = '';
        ops.forEach(function(e) {
            var t = config.option.template(e);
            templatedOption += t;
        })

        var html = `
        <div class="question" data-type=${o.type}>
            <div class="que-title">
                Q<i>${o.order}</i>  (${typeChinese[o.type]})
                <input type="text" class="que-describe" value="${v}" placeholder="题目的标题">
                <button class="btn btn-default btn-sm que-remove">删除该题</button>
            </div>
            <ol>
                ${templatedOption}
            </ol>
                <div class="option-add">
                添加选项
            </div>
        </div>
        `
        return html;
    },

    //  问答题的 html 模板
    templateByEssay: function(textInfo) {
        var o = textInfo;
        log('** o eassay', o.describe)
        var val = o.describe || '';
        var t = `
        <div class="question" data-type="2">
            <div class="que-title">
                Q<i>${o.order}</i> (问答题)
                <button class="btn btn-default btn-sm que-remove">删除该题</button>
            </div>
            <div  class="que-option textarea-option">
                <textarea class="option-content" rows="8" cols="80" value="" placeholder="问答题内容">${val}</textarea>
            </div>
        </div>
        `
        return t;
    },
}

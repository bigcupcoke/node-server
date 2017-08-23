var Que = function(form={}) {
    log(form, ' form ind ')
    this.title = form.title || ''
    this.id = form.id || ''
    this.qs = form.question || []
    this.init()
}

Que.create = function(form) {
    var instance =  new this(form);
    return instance;
}

Que.prototype = {
    constructor: Que,

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
            _t.changeorder(index);
            // log(order, 'index removed')
        })
    },

    removeAll: function() {
        var qs = $('.question');
        qs.remove();
    },

    //  从 起始序号的那个问题开始，跟着改变后面所有问题的序号
    changeorder: function(start) {
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

    bindEvents: function() {
        this.add();
        this.remove();
        this.save();
        this.revert();
    },

    //  返回 一个问题的 html 模板
    template: function(queInfo, index) {

        var q = queInfo;
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

        var _t = this;
        var template = {
            //  单选
            "0": _t.templateByChoice(o),
            //  多选
            "1": _t.templateByChoice(o),
            //  问答题
            "2": _t.templateByEssay(o),
        }
        return template[o.type];
    },

    //  选择题的 html 模板
    templateByChoice: function(optionsInfo) {
        var o = optionsInfo;
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
        var val = o.describe || '';
        var t = `
        <div class="question" data-type=2>
        <div class="que-title">
        Q<i>${o.order}</i> (问答题)
        <button class="btn btn-default btn-sm que-remove">删除该题</button>
        </div>
        <div  class="que-option textarea-option">
        <textarea class="option-content" rows="8" cols="80" value=${val} placeholder="问答题内容"></textarea>
        </div>
        </div>
        `
        return t;
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

    initTitle: function() {
        var _t = this;
        log('init title ok', _t)
        $('.questionnaire-title').val(_t.title);
        $('.questionnaire-title').data('questionnaireid', _t.id);
    },

    initQues: function() {
        var html = '';
        this.qs.forEach((function(info, i) {
            var t = this.template(info, i);
            html += t;
        }).bind(this))
        $('main').append(html);
    },

    init: function() {
        log('init all ques ok')
        this.initTitle();
        this.initQues();
        this.bindEvents();
    },

    save: function() {
        var _t = this;
        //  id 是 string 形式
        $('.questionnaire-save').on('click', function() {
            // var info = this.infoAll();
            // return info;
            _t.ajaxAdd();
        })
    },

    ajaxAdd: function() {
        var _t = this;
        var url = config.url.add;
        var data = _t.infoAll();
        // log('ajax send', $.ajax)
        $.ajax({
            method: 'post',
            data: data,
            url: url,
            success: function(data) {
                log(' ajax success', data);
                Popup.save();
            },
            error: function(error) {
                var s = JSON.stringify(error)
                log('*** error', s);
            },
        })
    },

    revert: function() {
        var _t = this;
        $('.questionnaire-revert').on('click', function() {
            // var info = this.infoAll();
            // return info;
            Popup.revert(function() {
                _t.removeAll()
            });
        })
    },

    infoAll: function() {
        var title = $('.questionnaire-title').val();
        var id = $('.questionnaire-title').data('questionnaireid');
        var quesInfo = this.infoFromQues(id);
        return {
            title: title,
            id: id,
            question: quesInfo
        };
    },

    infoFromQues: function(questionnaireId) {
        var _t = this;
        var qs = $('.question');
        var qId = questionnaireId;
        var r = [];
        for (var i = 0; i < qs.length; i++) {
            var e = $(qs[i]);
            var type = e.data('type');
            var id = qId + e.find('i').text();
            var describe = e.find('.que-describe').val();
            var optionsInfo =_t.infoFromOptions(id, e);
            var o = {
                id: id,
                subject: describe,
                isChoice: type,
                choice: optionsInfo,
            }
            r.push(o);
        }
        return r;
    },

    infoFromOptions: function(queId, que) {
        var p = que;
        var pid = queId;
        var options = p.find('.que-option');
        var r = [];
        for (var i = 0; i < options.length; i++) {
            var e = $(options[i]);
            var oId = i + 1;
            var id = pid + oId;
            var content = e.find('.option-content').val();
            // log(content,  'content');
            var o = {
                id: id,
                options: content,
            }
            r.push(o);
        }
        return r;
    },
}

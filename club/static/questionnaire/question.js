var Que = function(form={}) {
    log(form, ' form ind ')
    this.title = form.title || ''
    this.id = form.id || ''
    this.qs = form.question || []
    this.init();
}

Que.create = function(form) {
    var instance =  new this(form);
    return instance;
}

Que.prototype = {

    //  原型指向到 Que
    constructor: Que,

    initQues: function() {
        var qs = this.questions;
        qs.forEach((function() {

        }))
    },

    add: function(type) {
        var _t = this;
        $('.question-tool').on('click', 'button', function() {
            log('click add')
            var s = $(this);
            var type = s.data('type');
            var t = _t.templateByType(type);
            $('main').append(t);
        })
    },

    remove: function() {
        var _t = this;
        $('body').on('click', '.que-remove', function() {
            log('click remove')
            var s = $(this);
            var que = s.closest('.question');
            var index = que.index();
            var count = index + 1;
            que.remove();
            _t.changeCount(index);
            // log(count, 'index removed')
        })
    },

    changeCount: function(start) {
        var queAll = $('.question');
        var s = start;
        var qs = $(queAll.slice(s));
        // log(qs, 'qs')
        for (var i = 0; i < qs.length; i++) {
            var e = $(qs[i]);
            // log(e, 'e in for');
            var iTag = e.find('i');
            var count = Number(iTag.text());
            // log(i, 'i now remove')
            iTag.text(count - 1);
        }
    },

    templateByOption: function() {
        var i = index;
        var describe = {
            0: '单选题',
            1: '多选题',
        };
        var infos =
        var t = op.
        var t = `
        <div class="question" data-type=${type}>
            <div class="que-title">
                Q<i>${i}</i>  (${describe[type]})
                <input type="text" class="que-describe" value="" placeholder="没道题目的标题">
                <button class="btn btn-default btn-sm que-remove">删除该题</button>
            </div>
                ${options}
            <div class="option-add">
                添加选项
            </div>
        </div>
        `
        return t;
    },

    templateByText: function(index) {
        var i = index;
        var t = `
        <div class="question" data-type=2>
            <div class="que-title">
                Q<i>${i}</i> (问答题)
                <button class="btn btn-default btn-sm que-remove">删除该题</button>
            </div>
            <div  class="que-option textarea-option">
                <textarea class="option-content" rows="8" cols="80" placeholder="问答题内容"></textarea>
            </div>
        </div>
        `
        return t;
    },

    bindEvents: function() {
        this.add();
        this.remove();
        // this.save();
        this.revert();
    },

    templateByType: function(type) {
        var _t = this;
        var t = type;
        var i = _t.count();
        var template = {
            "0": _t.templateByOption(i, 0),
            "1": _t.templateByOption(i, 1),
            "2": _t.templateByText(i),
        }
        return template[t];
    },

    //  每题对应的序号， ＝下标 index+１
    count: function() {
        var len = $('.question').length;
        var count = -1
        if (len > 0) {
            count = len + 1;
        } else {
            count = 1;
        }
        return count;
    },

    initTitle: function() {
        var _t = this;
        log('init title ok', _t)
        $('.questionnaire-title').val(_t.title);
        $('.questionnaire-title').data('questionnaireid', _t.id);
    },

    initQues: function() {
        var _t = this;
        _t.qs.forEach((function() {
            var t = _t.t
        }))
    },

    init: function() {
        log('init ok ')
        this.initTitle();
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
        //  id 是 string 形式
        $('.questionnaire-revert').on('click', function() {
            // var info = this.infoAll();
            // return info;
            Popup.revert();
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

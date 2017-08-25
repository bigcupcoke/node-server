//  类： 问卷
var QueNarie = function(form) {
    log(form, ' form ind ')
    this.title = form.title || '';
    this.id = form.id || '';
    this.qs = form.question || [];
    this.que = config.que || null;
    if (form !== undefined) {
        this.init();
    }
}

QueNarie.create = function(form) {
    var instance =  new this(form);
    return instance;
}

QueNarie.prototype = {
    constructor: QueNarie,

    init: function() {
        log('init queNarie ok')
        this.initTitle();
        this.initQues();
        this.bindEvents();
    },

    initTitle: function() {
        var _t = this;
        log('init title ok')
        $('.questionnaire-title').val(_t.title);
        $('.questionnaire-title').data('questionnaireid', _t.id);
    },

    initQues: function() {
        var html = '';
        this.qs.forEach((function(info, i) {
            var t = this.que.template(info, i);
            html += t;
        }).bind(this))
        $('main').append(html);
    },

    // 问卷所有的数据
    infoAll: function() {
        var title = $('.questionnaire-title').val();
        var id = $('.questionnaire-title').data('questionnaireid');
        var quesInfo = this.infoFromQues(id);
        var o = {
            title: title,
            id: id,
            question: quesInfo
        };

        return {
            data: o
        }
    },

    // 每道题目的信息
    infoFromQues: function(questionnaireId) {
        var _t = this;
        var qs = $('.question');
        var qId = questionnaireId;
        var r = [];
        for (var i = 0; i < qs.length; i++) {
            var e = $(qs[i]);
            var type = e.data('type');
            // 题目的 id
            var id = qId + e.find('i').text();
            var o = {
                id: id,
                isChoice: type,
            }
            // log('type 2', [type])
            //  如果是 问答题，
            if (type === 2) {
                //  题目的问题描述
                var describe = e.find('.option-content').val();
            } else {
                //  是选择题
                //  题目的问题描述
                var describe = e.find('.que-describe').val();
                // 题目选项的信息
                var optionsInfo =_t.infoFromChoice(id, e);
                o.choice = optionsInfo;
            }
            // 问题描述
            o.subject = describe;
            r.push(o);
        }
        return r;
    },

    //  选择题的数据信息
    infoFromChoice: function(queId, que) {
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
                content: content,
            }
            r.push(o);
        }
        return r;
    },

    save: function() {
        var _t = this;
        //  id 是 string 形式
        $('.questionnaire-save').on('click', function() {
            // var info = this.infoAll();
            // return info;
            _t.sendInfo();
        })
    },

    //  向后退发送数据
    sendInfo: function() {
        var _t = this;
        var url = config.url.add;
        var data = _t.infoAll();
        // log('ajax send', $.ajax)
        $.ajax({
            method: 'post',
            data: data,
            url: url,
            success: function(data) {
                log(' send success', data);
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
            // 弹窗
            Popup.revert(function() {
                //  删除所有的问题
                var qs = $('.question');
                qs.remove();
                //  清空题目
                $('.questionnaire-title').text('');
            });
        })
    },

    bindEvents: function() {
        this.save();
        this.revert();
    },
}

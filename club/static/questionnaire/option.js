//  option 类
var Option = function(form) {
    this.init();
}


Option.create = function() {
    var instance =  new this();
    return instance;
}

Option.prototype = {

    //  原型指向到 Option
    constructor: Option,

    add: function() {
        var _t = this;
        $('body').on('click', '.option-add', function() {
            log('click option')
            var self = $(this);
            var ol = self.siblings('ol');
            // log(ol, 'ol')
            var counts = ol.find('.que-option').length;
            if (counts >= 5) {
                swal({
                    title: "选项数量达到上限",
                    text: "最多设置 10 个选项",
                    confirmButtonText: "确认"
                });
                // alert('最多只能设置10个选项');
            } else {
                var t = _t.template();
                // log(t)
                ol.append(t);
            }
        })
    },

    remove: function(btn) {
        log('click option')
        $('body').on('click', '.option-remove', function() {
            log('click option')
            var self = $(this);
            var option = self.closest('.que-option');
            option.remove();
        })
    },

    template: function(value) {
        var val = value || '';
        var t = `
            <li class="que-option">
                <input type="text" name="" value="${val}" placeholder="每个选项的内容">
                <button type="button" class="btn btn-default  btn-sm option-remove">删除</button>
            </li>
        `
        return t;
    },

    bindEvents: function() {
        this.add();
        this.remove();
    },

    init: function() {
        log('init')
        this.bindEvents();
    },
}

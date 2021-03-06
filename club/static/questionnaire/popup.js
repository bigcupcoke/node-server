// 类： 弹窗
//  这个 类 不需要实例， 方法直接挂在原型上
var Popup = function() {};

Popup.save = function() {
    if (!this.ie()) {
        swal("保存成功!", "你已成功!", "success")
    } else {
        alert("保存成功!")
    }
}

Popup.ie = function() {
    var ua = window.navigator.userAgent;
    var index = ua.indexOf('MSIE');
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}

Popup.revert = function(callback) {
    if (!this.ie()) {
        swal(
            {
                title: "确定还原吗？",
                text: "一旦还原你将失去所有已编辑的问卷！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定还原！",
                cancelButtonText: "取消还原！",
                closeOnConfirm: false,
                closeOnCancel: false
            },

            function(isConfirm) {
                if (isConfirm) {
                    callback()
                    swal("还原成功！", '问卷已还原', 'success');
                } else {
                    swal("取消！", "你的问卷数据是安全的!",
                    "error");
                }
            }
        );
    } else {
        if (confirm('确认还原吗')) {
            callback()
            alert('已还原');
        } else {
            //  取消的时候需要弹的 提示， 写在这里
        }
    }
}

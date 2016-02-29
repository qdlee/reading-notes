;(function(){
    /**
     * 显示消息框
     * @param  {[string]} type            [消息类型-可能的取值为：alert/message/confirm]
     * @param  {[string]} title           [消息标题]
     * @param  {[string]} content         [消息正文]
     * @param  {[string]} btnConfirm      [确定按钮文本]
     * @param  {[Function]} confirmCallback [确定按钮回调函数]
     * @param  {[Object]} param           [可选参数-有：btnCancle-取消按钮文本，cancleCallback-取消按钮回调函数，timer-消息框显示时长]
     */
    function showMsg(type,title,content,btnConfirm,confirmCallback,param) {

        $('.modal-backdrop').remove();
        $('#msgWrap').remove();
        var msgWrap = $('<div id="msgWrap" class="modal" tabindex="-1" role="dialog"></div>');
        var str = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">提示</h4></div><div class="modal-body"><p id="msg"></p></div><div class="modal-footer"></div</div</div>';
        msgWrap.html(str);
        var btnConfirm = $('<button type="button" class="btn btn-primary" data-dismiss="modal"></button>').html(btnConfirm);
        switch(type){
            case 'confirm':
                var btnCancle = $('<button type="button" class="btn btn-primary"></button>').html(param.btnCancle);
                btnCancle.click(function(){
                    // 关闭弹出窗口
                    closeMsg(param.cancleCallback);
                });
                msgWrap.find('.modal-footer:first').append(btnCancle).append(btnConfirm);
                break;
            case 'message':
            case 'alert': 
            default:
                msgWrap.find('.modal-footer:first').append(btnConfirm);
        }

        btnConfirm.click(function(){
            // 关闭弹出窗口
            closeMsg(confirmCallback);
        });
        msgWrap.find('.modal-title').html(title);
        msgWrap.find('#msg').html(content);
        $('body').append(msgWrap);

        $('#msgWrap').modal('show');

        autoClose();

        // 如果消息类型为"message"，就在指定时间内关闭窗口
        function autoClose () {
            if(type=="message"){
                setTimeout(function(){
                    closeMsg();
                },parseInt(param.timer));
            }
        }

        // 关闭窗口，如果有回调函数，就执行它
        function closeMsg (callback) {
            $('#msgWrap').modal('hide');
            // $('#msgWrap').remove();
            if(typeof callback=='function')
                callback();
        }
    }
    window.msg = {
        showMsg:showMsg
    };
})();








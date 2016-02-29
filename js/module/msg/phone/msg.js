function showMsg(type,title,content,btnConfirm,confirmCallback,param) {

    var msgWrap = $('<div></div>',{id:'msgWrap'});
    var msgBox = $('<div></div>',{id:'msgBox'});
    var msgTitle = $('<h1></h1>',{id:'msgTitle',html:title});
    var msgContent=$('<p></p>',{id:'msgContent',html:content});
    var msgButton = $('<div></div>',{id:'msgButton'});
    var btnConfirm = $('<span></span>',{id:'btnConfirm','class':'msg_btn',html:btnConfirm});

    switch(type){
        case 'confirm':
            var btnCancle = $('<span></span>',{id:'btnCancle','class':'msg_btn',html:param.btnCancle});
            btnConfirm.css({'borderBottomRightRadius':'13px','width':'50%'});
            btnCancle.css({'borderBottomLeftRadius':'13px','width':'50%'});
            btnCancle.click(function(){
                // 关闭弹出窗口
                closeMsg(param.cancleCallback);
            });
            msgButton.append(btnCancle).append(btnConfirm);
            break;
        case 'message':
        case 'alert': 
        default:
            btnConfirm.css({'borderBottomLeftRadius':'13px','borderBottomRightRadius':'13px','width':'100%'});
            msgButton.append(btnConfirm);
    }
    
    btnConfirm.click(function(){
        // 关闭弹出窗口
        closeMsg(confirmCallback);
    });
    
    msgBox.append(msgTitle).append(msgContent).append(msgButton).appendTo(msgWrap);
    $('body').append(msgWrap);

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
        $('#msgWrap').remove();
        if(typeof callback=='function')
            callback();
    }
}




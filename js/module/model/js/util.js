;(function(){
  window.browser={
      versions:function(){
          var u = navigator.userAgent, app = navigator.appVersion;
          return {
              trident: u.indexOf('Trident') > -1, //IE内核
              presto: u.indexOf('Presto') > -1, //opera内核
              webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
              gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
              mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
              ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
              android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
              iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
              iPad: u.indexOf('iPad') > -1, //是否iPad
              webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
              weChat: u.indexOf('MicroMessenger')> -1
          };
      }()
  };
})();

(function(){

  // 创建Iframe用来发送通知
  var createMsgIframe = (function() {
    msgIframe = document.createElement('iframe')
    msgIframe.style.display = 'none'
    document.documentElement.appendChild(msgIframe)
    return msgIframe;
  })();

  /**
   * 发送消息到webview
   * @return {[type]} [description]
   */
  var send = function(msg) {

    if(browser.versions.android){
      javatoJs.sendToAndroid(JSON.stringify(msg));
    }else{
      //在消息队列中添加一条消息
      this.message.push(JSON.stringify(msg));
      //通知webview
      this.msgIframe.src = this.PROTOCOL;
    }
  };

  /**
   * webview调用此方法获取消息
   * @return {[type]} [description]
   */
  var getMessage = function() {
    return this.message.shift();
  };

  var callJs = function(json){
    var jsObj = JSON.parse(json);
    this.resCallback[jsObj.cmd](jsObj.data);
  };

  var regCallback = function(name,fun){
    this.resCallback[name] = fun;
  };

  window.wjbridge = {
    PROTOCOL: "blkee://message",
    msgIframe: createMsgIframe,

    message: [],
    resCallback: {
      nothing:function(){},
    },

    send: send,
    regCallback:regCallback,

    callJs: callJs,
    getMessage: getMessage,
  };
})();


(function(){
  /**
   * 显示提示消息
   * @param  {[Object]} param [参数]
   * @param  {[string]} inBrowser  [类型--在应用内显示(app)还是在外部浏览器中显示(browser)]
   * @return {[type]}       [description]
   */
  function show (param,inBrowser) {
    if(inBrowser){
      showBrowser(param);
    }else{
      showApp(param);
    }
  }

  function showApp (param) {
      var title = param.title || '提示',
          left_btn = param.left_btn || '确定',
          left_cmd = param.left_cmd || 'nothing';

      var msg = {
        cmd:'show_msg',
        data:{
          title:title,
          content:param.content,
          left_btn:left_btn,
          left_cmd:left_cmd
        }
      };
      if(param.type==='confirm'){
        msg.data.right_btn = param.right_btn || '取消';
        msg.data.right_cmd = param.right_cmd || 'nothing';
      }
      wjbridge.send(msg);
  }

  function showBrowser(param) {
      var title = param.title || '提示',
          left_btn = param.left_btn || '确定',
          right_btn = param.right_btn || '取消';

      var msgWrap = $('<div id="msgWrap"></div>');
      var msgBox = $('<div id="msgBox"></div>');
      var msgTitle = $('<h1 id="msgTitle"></h1>').html(title);
      var msgContent=$('<p id="msgContent"></p>').html(param.content);
      var msgButton = $('<div id="msgButton"></div>');
      var btnConfirm = $('<span id="btnConfirm" class="msg_btn"></span>').html(left_btn);

      switch(param.type){
          case 'confirm':
              var btnCancle = $('<span id="btnCancle" class="msg_btn"></span>').html(right_btn);
              btnConfirm.css({'borderBottomRightRadius':'13px','width':'50%'});
              btnCancle.css({'borderBottomLeftRadius':'13px','width':'50%'});
              btnCancle.click(function(){
                  // 关闭弹出窗口
                  closeMsg(param.right_cmd);
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
          closeMsg(param.left_cmd);
      });

      msgBox.append(msgTitle).append(msgContent).append(msgButton).appendTo(msgWrap);
      $('body').append(msgWrap);

      autoClose();

      // 如果消息类型为"message"，就在指定时间内关闭窗口
      function autoClose () {
          if(param.type=="message"){
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

  window.msg = {
    show:show
  }
})();

(function(){

  //ajax异常处理函数
  var errorFun;
  /**
   * 通过ajax加载数据
   * @param  {[type]} loadUrl [接口]
   * @param  {[type]} info   [发送到服务器信息]
   */
  function doAjax (loadUrl,info,sucFun,failFun,notMsg,method) {
    method = method || 'POST';
    info = typeof info === "string" ? info : JSON.stringify(info);
    $.ajax({
      type: method,
      url: loadUrl,
      data: info,
      dataType: 'json',
      timeout: 300,
      context: $('body'),
      success: function(data){
        if(checkResult(data)){
          sucFun(data);
        }else{
          //显示错误消息
          if(notMsg){
            failFun(data.result);
          }else{
            msg.show({
              type:'alert',
              content:data.result_msg,
              right_btn:failFun
            });
          }
        }
      }
    })
  }

  /**
   * 注册错误处理函数
   * @param  {[Function]} fun [错误处理函数]
   */
  function regErrorFun (fun) {
    errorFun = fun;
  }

  /**
   * 检查返回的数据是否正常
   * @param  {[type]} data [返回来的数据]
   * @return {[type]}      [数据正常返回true，否则返回false]
   */
  function checkResult (data) {
    if(data.result_code && data.result_code == 100001){
      return true;
    }
    return false;
  }

  /**
   * ajax异常处理
   * 执行注册的错误处理函数
   */
  (function solveError () {
    $(document).on('ajaxError',function(event,request, settings){
        var content = '网络异常，请重试！';
        msg.show({
          type:'alert',
          content:content,
          right_btn:errorFun
        });
    });
  })();

  window.zajax = {
    doAjax:doAjax,
    regErrorFun:regErrorFun
  }
})();

(function(){
  /**
   * 模板相关
   */
  var regexp = /(?:\{\{)([a-zA-z][^\s\}]+)(?:\}\})/g;

  var render = function(template,data) {
    return template.replace(regexp, function(fullMatch, p2) {
      
      if(data[p2]) {
        return data[p2];
      } else {
        return '';
      }
    });
  }

  /**
   * 使用获取的json数据填充模板并插入DOM
   * @param  {[type]} data [json数据]
   */
  function fillData(data,template,container) {
      var domStr = '';
      for (var i in data) {
          domStr += render(template, data[i]);
      }
      container.html(domStr);
  }
  window.template = {
    fillData:fillData
  }
})();


/**
 * 长按复制文本功能
 * @param  {[DOM]} target [文本容器]
 */
function touchCopy (target) {

    var st; //定时器

    // 选择文本
    function selectText(container) {
      var doc = document,
          range,
          selection;

      if (doc.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(container);
          range.select();
      } else if (window.getSelection) {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(container);
          selection.removeAllRanges();
          selection.addRange(range);
      }
    }
    
    // 长按复制功能
    target.on('touchstart',function(e){
        st = setTimeout(function(){
          selectText(e.target);
        },750);
    });
    target.on('touchend',function(e){
        clearTimeout(st);
    });
}
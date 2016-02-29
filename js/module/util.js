;
//浏览器检测
(function(){
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

//webview/js交互
(function(){

  var PROTOCOL = "blkee://message",//协议url
      message = [],//消息集合
      //存储回调函数的对象
      resCallback = {
        nothing:function(){},
      },
      // 创建Iframe用来发送通知
      msgIframe = (function() {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.documentElement.appendChild(iframe);
        return iframe;
      })();

 /**
  * 发送消息到webview
  * @param  {[object]} msg [消息]
  */
  var send = function(msg) {

    //如果是android的情况
    if(browser.versions.android){
      javatoJs.sendToAndroid(JSON.stringify(msg));
    }else{
      //在消息队列中添加一条消息
      message.push(JSON.stringify(msg));
      //通知webview
      msgIframe.src = PROTOCOL;
    }
  };

  /**
   * webview调用此方法获取消息
   * @return {[string]} [集合中最上面一条消息]
   */
  var getMessage = function() {
    return message.shift();
  };

  /**
   * webview直接调用js函数
   * @param  {json} json [包含要调用的函数和参数。cmd-函数名；data-参数]
   */
  var callJs = function(json){
    var jsObj = JSON.parse(json);
    resCallback[jsObj.cmd](jsObj.data);
  };

  /**
   * 注册回调函数
   * @param  {[string]} name [函数名称]
   * @param  {[function]} fun  [回调函数]
   */
  var regCallback = function(name,fun){
    resCallback[name] = fun;
  };

  window.wjbridge = {
    send: send,
    regCallback:regCallback,
    callJs: callJs,
    getMessage: getMessage
  };

})();

//显示消息提示
(function(){
  /**
   * 显示提示消息
   * @param  {[Object]} param [参数]
   */
  function show (param) {
    if(inBrowser){
      showBrowser(param);
    }else{
      showApp(param);
    }
  }

  function showApp (param) {
      var title = param.title || '提示',
          left_btn = param.left_btn || '确定',
          left_cmd = 'nothing';
      if(typeof param.left_cmd === 'function'){
        left_cmd = "left_cmd";
        wjbridge.regCallback('left_cmd',param.left_cmd);
      }

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
        msg.data.right_cmd = 'nothing';
        if(typeof param.right_cmd === 'function'){
          msg.data.right_cmd = "right_cmd";
          wjbridge.regCallback('right_cmd',param.right_cmd);
        }
      }
      wjbridge.send(msg);
  }

  function showBrowser(param) {

      var title = param.title || '提示',
          left_btn = param.left_btn || '确定',
          right_btn = param.right_btn || '取消',
          type = param.type || 'alert';

      var msgWrap = $('<div id="msgWrap"></div>');
      var msgBox = $('<div id="msgBox"></div>');
      var msgTitle = $('<h1 id="msgTitle"></h1>').html(title);
      var msgContent=$('<p id="msgContent"></p>').html(param.content);
      var msgButton = $('<div id="msgButton"></div>');
      var btnConfirm = $('<span id="btnConfirm" class="msg_btn"></span>').html(left_btn);

      switch(type){
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

//ajax
(function(){

  //ajax异常处理函数
  var errorFun;
  /**
   * 通过ajax加载数据
   * @param  {[type]} loadUrl [接口]
   * @param  {[type]} info   [发送到服务器信息]
   */
  function doAjax (url,info,sucFun,failFun,notMsg,method) {
    method = method || 'POST';
    info = typeof info === "string" ? info : JSON.stringify(info);
    $.ajax({
      type: method,
      url: url,
      data: info,
      dataType: 'json',
      success: function(data){
        if(checkResult(data)){
          sucFun(data);
        }else{
          //显示错误消息
          if(notMsg){
            failFun(data);
          }else{
            msg.show({
              content:data.result_msg,
              left_cmd:failFun
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
    $(document).on('ajaxError',function(event,request,settings){
        var content = '网络异常，请重试！';
        msg.show({
          content:content,
          left_cmd:errorFun
        });
    });
  })();

  window.zajax = {
    doAjax:doAjax,
    regErrorFun:regErrorFun
  }
})();

/**
 * 模板相关
 */
(function(){
  var regexp = /(?:\{\{)([a-zA-z][^\s\}]+)(?:\}\})/g;

  var render = function(template,data) {
    return template.replace(regexp, function(fullMatch, p2) {
      var ps = p2.split('&'),
          rv;
      switch(ps[0]){
        case 'default':
          rv = data[ps[1]];
          break;
        case 'branch':
          var option = JSON.parse(ps[2].replace('(','{').replace(')','}'));
          rv = option[data[ps[1]]];
          break;
        case 'loop':
          var str = '';
          var ds = data[ps[1]];
          var key = ps[2];
          for(var i in ds){
            if(key==='option'){
              var k = Object.keys(ds[i])[0];
              str += '<option value="'+k+'">'+ds[i][k]+'</option>';
            }else{
              str += '<'+ps[2]+'>'+ds[i]+'</'+ps[2]+'>';
            }
          }
          rv = str;
          break;
      }
      return rv;
    });
  }

  /**
   * 使用获取的json数据填充模板并插入DOM
   * @param  {[type]} data [json数据]
   */
  function fillData(data,template,container) {
      var domStr = '';
      //如果是数组就循环，否则直接替换
      if(data instanceof Array){
        for (var i in data) {
            domStr += render(template, data[i]);
        }
      }else{
        domStr += render(template, data);
      }
      container.html(domStr);
  }
  window.temp = {
    fillData:fillData
  }
})();

//自动事件绑定
(function(){
  var eventMethod = {};//事件方法的集合

  //绑定事件
  function bind() {
    $('.event').each(function(){
      var ev = $(this).data('event').split('#');
      if(ev[2]){
        $(this).on(ev[0],ev[2],function(e){
          e.stopPropagation();
          e.preventDefault();
          eventMethod[ev[1]]();
        });
      }else{
        $(this).on(ev[0],function(e){
          e.stopPropagation();
          e.preventDefault();
          eventMethod[ev[1]]();
        });
      }
    });
  }

  //注册事件方法集合
  function regEventMethod(method) {
    eventMethod = method;
  }

  window.ebind={
    bind:bind,
    regEventMethod:regEventMethod
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
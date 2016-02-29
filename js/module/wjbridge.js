;(function(){
	if(window.wjbridge) return;

	var browser={
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


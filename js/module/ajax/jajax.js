;(function(){

	//ajax异常处理函数
	var errorFun;
	var devDebug = true;//调试模式

	/**
	 * 通过ajax加载数据
	 * @param  {[string]} loadUrl [接口]
	 * @param  {[type]} info    [发送到服务器信息]
	 * @param  {[type]} sucFun  [请求数据符合要求时调用]
	 * @param  {[type]} failFun [请求数据不符合要求时调用]
	 * @param  {[type]} notMsg  [是否只执行failFun]
	 * @param  {[type]} method  [请求方式GET/POST]
	 */
	function doAjax (loadUrl,info,sucFun,failFun,notMsg,method) {
		// info = typeof info === "string" ? info : JSON.stringify(info);
		if(method == 'get'){
			$.get(loadUrl,info,function(data){
				if(checkResult(data)){
					sucFun(data);
				}else{
					//显示错误消息
					if(notMsg){
						failFun(data);
					}else{
						msg.showMsg('alert','提示',data.info,'确定',failFun);
					}
				}
			},'json');
		}else{
			$.post(loadUrl,info,function(data){
				if(checkResult(data)){
					sucFun(data);
				}else{
					//显示错误消息
					if(notMsg){
						failFun(data);
					}else{
						msg.showMsg('alert','提示',data.info,'确定',failFun);
					}
				}
			},'json');
		}
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
		if(parseInt(data.status)){
			return true;
		}
		return false;
	}

	/**
	 * ajax异常处理
	 * 执行注册的错误处理函数
	 */
	(function() {
		$(document).ajaxError(function(event,request, settings){
			if(devDebug){
				console.log(request.responseText);
			}else{
	     		msg.showMsg('alert','提示','网络异常，请重试！','确定',errorFun);
			}
		});
	})();

	window.jajax = {
		doAjax:doAjax,
		regErrorFun:regErrorFun
	}
})();

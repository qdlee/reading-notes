;(function(){

	//ajax异常处理函数
	var errorFun;

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
		  	if(_checkResult(data)){
		  		sucFun(data);
		  	}else{
		  		//显示错误消息
		  		if(notMsg){
		  			failFun(data);
		  		}else{
		  			showMsg('alert','提示',data.info,'确定',failFun);
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
	function _checkResult (data) {
		if(data.result_code && data.result_code == 100001){
			return true;
		}
		return false;
	}

	/**
	 * ajax异常处理
	 * 执行注册的错误处理函数
	 */
	(function() {
		$(document).on('ajaxError',function(event,request, settings){
	     	showMsg('alert','提示','网络异常，请重试！','确定',errorFun);
		});
	})();

	window.zajax = {
		doAjax:doAjax,
		regErrorFun:regErrorFun
	}
})();
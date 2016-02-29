var GL={};

/**
 * 初始化
 * @param  {[type]} showMsg    [是否显示消息框]
 * @param  {[type]} errorFun   [出错时的处理函数]
 * @param  {[type]} successFun [成功时的处理函数]
 * @return {[type]}            [无]
 */
function initAjax (errorFun,successFun) {
	GL.errorFun = errorFun;
	GL.successFun = successFun;
	solveError();
}

/**
 * 通过ajax加载数据
 * @param  {[type]} loadUrl [接口]
 * @param  {[type]} token   [携带信息]
 * @return {[type]}         [无]
 */
function loadData (loadUrl,processMethod,token) {
	$.post(loadUrl,token,function(data){
		if(checkResult(data)){
			processMethod(data);
		}else{
			//显示错误消息
			showMsg('alert','提示',data.result_msg,'确定',GL.errorFun);
		}
	},'json');
}


/**
 * 提交数据
 * @param  {[type]} submitUrl [提交接口]
 * @param  {[type]} reData    [提交数据]
 * @return {[type]}           [无]
 */
function submitData (submitUrl,reData,) {
	$.post(submitUrl,reData,function(data){
		if(checkResult(data)){
			//成功处理函数
			GL.successFun();
		}else{
			//显示错误消息
			showMsg('alert','提示',data.result_msg,'确定',GL.errorFun);
		}
	});
}

/**
 * ajax异常处理
 * @return {[type]} [无]
 */
function solveError () {
	$(document).ajaxError(function(event,request, settings){
     	showMsg('alert','提示','网络异常，请重试！','确定',GL.errorFun);
	});
}

/**
 * 检查返回的数据是否正常
 * @param  {[type]} data [返回来的数据]
 * @return {[type]}      [数据正常返回true，否则返回false]
 */
function checkResult (data) {
	if(data.result_code && data.result_code==100001){
		return true;
	}
	return false;
}

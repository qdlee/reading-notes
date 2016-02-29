/**
 * event对象在不同浏览器下表现形式不一样，在IE低版本中是全局对象
 * 在其它浏览器中是作为事件处理函数的参数。
 */

/*
	用一个变量来存储event对象
 */
var e = window.event || ev;

/*
	获取触发事件的对象
	IE使用属性srcElement
	标准属性target
 */
var el = e.srcElement || e.target;

/*
	获取触发事件的对象
 */
function getEventTarget (ev) {
	var e = window.event || e;
	var el = e.srcElement || e.target;
	return el;
}

/*
	阻止事件冒泡
	IE-属性cancelBubble设为true
	标准-stopPropagation()
 */
if (e.cancleBubble) {
	e.cancleBubble = true;
}else{
	e.stopPropagation();
}

/*
	添加/删除事件监听器
	IE-添加：attachEvent() 删除：detachevent()
	标准-添加：addEventListener() 删除：removeEventListener()
	都接收2个参数，第一个参数是事件类型，IE需要加on，第二个是处理函数，一个变量。
 */
function addEventHandler (node,eventType,handler) {
	if (isIE()) {
		node.attachEvent("on"+eventType,handler);
	}else{
		node.addEventListener(eventType,handler);
	}
}
/*
	删除事件处理器
 */
function removeEventHandler (node,eventType,handler) {
	if (isIE()) {
		node.detachEvent("on"+eventType,handler);
	}else{
		node.removeEventListener(eventType,handler);
	}
}
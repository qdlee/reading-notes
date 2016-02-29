# 事件

## HTML5事件

### 1、contextmenu事件

* 显示上下文菜单
* 由于contextmenu事件是冒泡的，因为可以为document指定一个事件处理程序，用以处理页面中发生的所有此类事件。
* 事件目标是发生用户操作的元素。
* 通常使用contextmenu事件来显示自定义的上下文菜单，而使用onlick事件处理程序来隐藏该菜单。

### 2、beforeunload事件

在浏览器卸载页面前触发，可以通过它来通知用户页面将被卸载，由用户决定是否卸载页面。

为了显示这个弹出对话框，必须将event.returnValue的值设置为要显示给用户的字符串(对IE及Firefox而言)，同时作为函数的返回值返回(对Safari和Chrome而言)。

### 3、DOMContentloaded事件

在形成完整的DOM树之后就会触发。

### 4、pageshow和pagehide事件

往返缓存(back-forward cache或者bfcache):用于在前进、后退时加快页面的转换速度。缓存中保存着页面中的所有数据。
如果页面从bfcache中被加载，就不会触发load事件。
pageshow事件在页面加载完成时(load事件之后)就会触发，无论是否从bfcache中加载。
pageshow事件的event对象包含一个名为persisted的布尔值属性：true-页面在bfcache中，false-页面不在bfcache中。
pagehide在页面卸载时触发(unload事件之前)。
pageshow事件的event对象包含一个名为persisted的布尔值属性：true-页面将被保存在bfcache中，false-页面不被保存在bfcache中。
这两事件都在document上触发但事件处理程序必须添加到window对象。
指定了onunload事件处理程序的页面会被自动排除在bfcache之外，即使事件处理程序是空的。

### 5、hashchange事件
在URL的参数列表(及URL中"#"号后面的所有字符串)发生变化时触发。
必须把hashchange事件处理程序添加给window对象。

##设备事件

### 1、orientationchange事件(Safari)

确定用户何时将设备由横向查看模式切换为纵向查看模式。
window.orientation属性中包含3个值：0-肖像模式，90-左旋转的横向模式(按钮在右侧)，-90-向右旋转的横向模式(按钮在左侧)

### 2、deviceorientation事件

在加速计检测到设备方向变化时在 window 对象上触发

### 3、devicemotion事件

这个事件是要告诉开发人员设备
什么时候移动，而不仅仅是设备方向如何改变。




### 一、加载require.js

<script src="js/require.js" data-main="js/main"></script>
data-main属性：指定要requirejs加载的主模块，是一个js文件

### 二、主模块中加载依赖

requirejs(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){

　　　　// some code here

});
requirejs()函数接受两个参数。
第一个参数是一个数组，表示所依赖的模块；
第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。
加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块。

### 三、编写配置文件

requirejs.config({
　　　　baseUrl: "js/lib",
　　　　paths: {
　　　　　　"jquery": "jquery.min",
　　　　　　"underscore": "underscore.min",
　　　　　　"backbone": "backbone.min"
　　　　}
});
baseUrl：模块的根路径
paths属性：指定各个模块的加载路径

### 四、AMD模块的写法

如果一个模块不依赖其他模块，那么可以直接定义在define()函数之中
define(function (){
	
});

如果这个模块还依赖其他模块，那么define()函数的第一个参数，必须是一个数组，指明该模块的依赖性。
define(['myLib'], function(myLib){

});

### 五、加载非规范的模块

requirejs.config({
　　　　shim: {
　　　　　　'backbone': {
　　　　　　　　deps: ['underscore', 'jquery'],
　　　　　　　　exports: 'Backbone'
　　　　　　}
　　　　}
});
shim属性：用来配置不兼容的模块
exports值（输出的变量名）：表明这个模块外部调用时的名称
deps数组：表明该模块的依赖性
简写形式：文件：deps数组
requirejs.config({
　　　　shim: {
　　　　　　"backbone" : ['underscore', 'jquery']
　　　　}
});

### 六、优化js文件（合并）

#### 1、合并单个文件
使用r.js
配置文件buid.js
({
    baseUrl: ".",
    paths: {
        jquery: "lib/jquery-latest",
        "bootstrap.min":"lib/bootstrap.min",
        theme:"lib/theme",
        requireLib:"lib/require"
    },
    include:"requireLib",
    name: "signin",
    out: "main-built.js"
})
baseUrl:根目录
paths：模块路径
name：优化入口文件
out：优化后输出文件
include：合并文件包含require.js时使用
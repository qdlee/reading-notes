# vue框架

## vue实例

### 创建

使用vue构造函数

````js
const vm = new Vue({
    //options
});
````
### 扩展vue构造函数
````js
const myComponent = Vue.extent({
    //extension options
});
const myComponentInstance = new myComponent();
````

不推荐使用扩展的方式，推荐使用声明式的组合自定义元素的方式。每个vue组件本质上都是扩展的vue实例。

### 属性和方法

* vue会代理data对象中的所有属性，使他们成为响应式的。但在vue实例创建之后附加的属性不会被代理
* vue提供了一些实例属性和实例方法，它们都以“$”为前缀。
* 不要在vue实例属性或者回调函数上使用箭头方法，会有this绑定问题

### vue实例生命周期
![vue实例生命周期](./lifecycle.png)

## 模板语法

### 插值

* 只能用于文本
* 使用Mustache语法
* 会对html标签进行转义
* 对应于data中的属性，会响应属性的更改

````html
<span>{{msg}}</span>
````
可以使用v-once指定使插值不改变，但也会影响节点上绑定的属性
````html
<span v-once>{{msg}}</span>
````

### 原始html

使用v-html指定来输出未经转义的html标签

````html
<div v-html="rawHtml"></div>
````

### 标签属性

使用v-bind指令定义
````html
<div v-bind:id="dynamicId"></div>
````
也可以定义布尔属性，值为false时删除属性
````html
<button v-bind:disabled="isButtonDisabled">Button</button>
````

### 使用Javascript表达式
````html
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
````
* 只能使用单个表达式，不能使用语句
* 只能访问白名单中的全局变量，不能访问自定义对象

### 过滤器

* 用于进行文本格式操作
* 只能用在**插值**和**v-bind**指令中
* 跟在要应用的属性之后，以管道符**|**分隔
* 可以链接使用多个过滤器
* 过滤器可以接受多个参数，第一个参数为原始文本，从第二个参数开始是传入的参数
````html
<!-- in mustaches -->
{{ message | capitalize }}
<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
<!--chain-->
{{ message | filterA | filterB }}
<!--arguments-->
{{ message | filterA('arg1', arg2) }}
````

## 指令

以**v-**为前缀的特殊html属性。
````html
<a v-bind:href="url"></a>

<form v-on:submit.prevent="onSubmit"></form>
````

### 指令的参数

在指令名称后以**:**为前缀。

### 指令修饰符

在指令参数后以**.**为前缀。可以链式添加修饰符

### 指令的缩写

v-bind => :
v-on => @

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

* v-bind => :
* v-on => @

## 计算属性

* 用于需要对属性进行复杂逻辑操作的地方。
* 用于需要根据多个值来计算当前属性值的情况。
* 计算属性依赖于其它属性，在其它属性值改变时，计算属性的值也随之改变。
````html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
````
````js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('')
    }
  }
})
````

### 计算属性VS方法

计算属性会缓存它的值，只有当它的依赖属性的值发生变化时才会重新进行计算，在执行较重的任务时，可以提高性能。方法每次都会进行计算。

### 计算属性的setter方法

默认情况下计算属性是只读的，但也可以通过提供setter方法来改变它的值
````js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
````
## 属性监视器

* 用于监视单个属性。
* 当对某个属性的改变进行一个异步操作或者较重的操作时尤其有用。

````html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>

<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to just use what you're familiar with. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // whenever question changes, this function will run
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        if (this.question.indexOf('?') === -1) {
          this.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        this.answer = 'Thinking...'
        var vm = this
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  }
})
</script>
````

## class和style绑定

### class绑定
* v-bind:class=""
* 可以和class属性一同使用
#### 对象语法

class名称：布尔型变量。在布尔变量为true时添加。
````html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
<script>
    data: {
        isActive: true,
        hasError: false
    }
</script>
````

#### 数组语法

[class属性变量...]

````html
<div v-bind:class="[activeClass, errorClass]">
<div v-bind:class="[isActive ? activeClass : '', errorClass]">
<div v-bind:class="[{ active: isActive }, errorClass]">
<script>
    data: {
        isActive: true,
        activeClass: 'active',
        errorClass: 'text-danger'
    }
</script>
````
#### 和组件一起使用

当给自定义组件添加**class**属性时，这些属性会被添加到组件的要元素上，根元素上已经存在的属性不会被覆盖。

### 行内样式绑定

* v-bind:style=""

#### 对象语法
````html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<script>
    data: {
        activeColor: 'red',
        fontSize: 30
    }
</script>
<div v-bind:style="styleObject"></div>
<script>
    data: {
        styleObject: {
            color: 'red',
            fontSize: '13px'
        }
    }
</script>
````

#### 数组语法

可以应用多个对象。

#### 自动浏览器前缀

会给需要浏览器前缀的属性自动添加浏览器前缀。

#### 多个值

可以给某个属性提供一个数组，数组中包含多个与浏览器相关的值，这只会渲染浏览器支持的最后一个值。

````html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }">
````

## 条件渲染

### v-if
### v-else-if
### v-else

````html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
````

### 和<template>一起使用

用于多于一个元素的情况

````html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
````

### 使用**key**来控制元素重用

Vue在进行切换的时候，会重用某些可以重用的元素，而不是重新进行渲染。如果要不让Vue进行元素的重用，可以给元素加上**key**属性，对元素进行唯一标识。

````html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
````

### v-show

* 初始化时就会对元素进行渲染，通过css的display属性进行显示隐藏控制。
* 不能用于<template>元素，也不能使用**v-else**

### **v-if** VS **v-show**

* **v-if**是真正的条件渲染，它会确保条件块内的事件监听及子组件被销毁并重新创建。
* 只有当条件为真时，**v-if**条件块内的元素才会被渲染。
* **v-if**有更高的切换开销；**v-show**有更高的初始渲染开销。

### **v-if** 和 **v-for**

* **v-for**的优先级高于**v-if**

## 列表渲染

* 使用**v-for**指令
* 语法是`item in items`,其中**in**可以用**of**代替
* **v-for**中可以访问父级作用域中的属性
* 可以为**v-for**指定一个index属性作为当前迭代值的索引

````html
  <li v-for="item in items">
    {{ item.message }}
  </li>

  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>

  <div v-for="item of items"></div>
````

### Template v-for

````html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
````
### Object v-for

````html
  <li v-for="value in object">
    {{ value }}
  </li>

  <div v-for="(value, key) in object">
    {{ key }} : {{ value }}
  </div>

  <div v-for="(value, key, index) in object">
    {{ index }}. {{ key }} : {{ value }}
  </div>
````

### Range v-for

````html
  <div>
    <span v-for="n in 10">{{ n }} </span>
  </div>
````

### 组件和`v-for`

* 可以像普通元素那样对组件使用v-for
* 需要给组件提供一个`key`属性，用来唯一标识每一项
* 迭代的项目不会直接在组件中使用，需要使用`props`来进行传递

```html
  <my-component
    v-for="(item, index) in items"
    v-bind:item="item"
    v-bind:index="index"
    v-bind:key="item.id">
  </my-component>
```

### `key`属性

Vue默认使用一个叫做`in-place patch`的策略来更新`v-for`列表。当列表元素的顺序改变时，Vue不会重新排列DOM元素，而是就地改变DOM元素，使之符合当前所对应的列表项目。但这种方式不能依赖子组件状态和临时DOM状态。

要让Vue追踪每个元素，以此来重用或者重新排列已有元素，需要给每一个元素提供一个`key`，用作唯一标识符。推荐给每一个`v-for`元素都提供`key`属性。

### 数组改变的探测

Vue包装了一些数组方法，在执行这些方法时会触发视图更新。
* `push()`
* `pop()`
* `shift()`
* `unshift()`
* `splice()`
* `sort()`
* `reverse()`

#### 替换数组

有一些数据操作不会改变原数据，而是会返回一个新的数组。例如`filter()`,`concat()`和`slice()`,当执行这些操作时可以直接用新数组来替换旧的数组。

#### 警告

由于js的限制，Vue检测不到下面两种数据的改变

1. 直接通过索引来设置元素的值
2. 改变数组的长度

解决方法

1. 
```js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)

// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```
2. 
```js
example1.items.splice(newLength)
```

### 显示过滤/排序过的结果

使用计算属性
```html
<li v-for="n in evenNumbers">{{ n }}</li>
```
```js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

对于不适合使用计算使用的情况(例如嵌套的`v-for`)，使用方法

```html
<li v-for="n in even(numbers)">{{ n }}</li>
```

```js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

## 事件处理

* 使用`v-on`指令来监听事件，`v-on`可以简写为`@`
* `v-on`的值可以是js表达式
* `v-on`的值可以是一个方法名，默认的参数是事件对象
* `v-on`的值可以是对方法的调用，这时可以显式的使用`$event`作为事件对象参数传递给方法。

```html
 <button v-on:click="counter += 1">Add 1</button>

   <!-- `greet` is the name of a method defined below -->
  <button v-on:click="greet">Greet</button>

  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```
### 事件修饰符

* 用来简化一些通用操作。
* 修饰符的顺序会对结果有影响

* `.stop`
* `.prevent`
* `.capture`
* `.self`
* `.once`，可以用在组件上面

```html
<!-- the click event's propagation will be stopped -->
<a v-on:click.stop="doThis"></a>
<!-- the submit event will no longer reload the page -->
<form v-on:submit.prevent="onSubmit"></form>
<!-- modifiers can be chained -->
<a v-on:click.stop.prevent="doThat"></a>
<!-- just the modifier -->
<form v-on:submit.prevent></form>
<!-- use capture mode when adding the event listener -->
<!-- i.e. an event targeting an inner element is handled here before being handled by that element -->
<div v-on:click.capture="doThis">...</div>
<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div v-on:click.self="doThat">...</div>

<!-- the click event will be triggered at most once -->
<a v-on:click.once="doThis"></a>
```

### 按键修饰符

可以使用keycode来监听键盘事件

```html
<!-- only call vm.submit() when the keyCode is 13 -->
<input v-on:keyup.13="submit">
```

对于一些常用的按键，为了便于记忆，给它们起了别名

* `.enter`
* `.tab`
* `.delete`，捕获`Delete`和`Backspace`两个键
* `.esc`
* `.space`
* `.up`
* `.down`
* `.left`
* `.right`

可以自定义按键修饰符

```js
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

### 修饰符按键

用于组合按键。

只有当这些键处于按下状态，再去按另一个键时，都会触发事件。

* `.ctrl`
* `.alt`
* `.shift`
* `.meta`，所在操作系统的专有键

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">
<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

### 鼠标按键修饰符

* `.left`
* `.right`
* `.middle`

## 表单输入绑定

* 使用`v-model`指令在表单的`input`、`select`和`textarea`元素上创建双向数据绑定
* `v-model`会忽略`value`, `checked`,`selected`属性的初始值，需要使用`data`来初始化
* 对于需要IME的语言，在输入的过程中，`v-model`不会更新。如果需要在输入的时候获取值，需要绑定`input`事件

### 文本

```html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

### 多行文本（textarea)

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

### checkbox

```html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames }}</span>
```

```js
new Vue({
  el: '...',
  data: {
    checkedNames: []
  }
})
```

### radio

```html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
```

### select

如果`select`的初始值没有匹配到`option`，就会显示为未选中状态，在iOS中这样会导致用户不能选中第一个选项，因为这种情况下，iOS不会触发change事件。所以需要给`select`提供一个值为空的禁用状态的`option`

```html
<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
#### 如果是多项选择，`v-model`需要是数组。

```html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected }}</span>
```
#### 使用`v-for`动态渲染`option`

```html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
```

```js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
```

### 值的绑定

对于`v-model`的值，`select`、`radio`的值是字符串，`checkbox`的值是布尔值。可以使用`v-bind`来绑定Vue实例上的属性，来实现非字符串值。

```html
<!-- `picked` is a string "a" when checked -->
<input type="radio" v-model="picked" value="a">
<!-- `toggle` is either true or false -->
<input type="checkbox" v-model="toggle">
<!-- `selected` is a string "abc" when selected -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

#### checkbox

```html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>
```

```js
// when checked:
vm.toggle === vm.a
// when unchecked:
vm.toggle === vm.b
```
#### radio

```html
<input type="radio" v-model="pick" v-bind:value="a">
```

```js
// when checked:
vm.pick === vm.a
```
#### select

```html
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

```js
// when selected:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

### 修饰符

#### `.lazy`

在`change`事件时才同步数据

```html
<!-- synced after "change" instead of "input" -->
<input v-model.lazy="msg" >
```
#### `.number`

把输入值转换为数字

```html
<input v-model.number="age" type="number">
```
#### `.trim`

去除输入值前后的空格

```html
<input v-model.trim="msg">
```

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
## 组件

### 使用组件

#### 注册组件

使用`Vue.component(tagName, options)`, 注册之后可以当做自定义元素使用。

```html
<div id="example">
  <my-component></my-component>
</div>
```

```js
// register
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
// create a root instance
new Vue({
  el: '#example'
})
```

结果

```html
<div id="example">
  <div>A custom component!</div>
</div>
```

#### 本地注册组件

* 可以在某个组件内注册组件，使被注册组件只能在其父组件内使用。
* 使用`components`属性

```js
var Child = {
  template: '<div>A custom component!</div>'
}
new Vue({
  // ...
  components: {
    // <my-component> will only be available in parent's template
    'my-component': Child
  }
})
```

#### DOM模板解析警告

在HTML中对一些标签中能够出现的标签有限制，例如：`ul`,`ol`,`table`,`select`，有一些标签只能出现在特定的标签之内，例如：`option`。

这种情况会引起错误

```html
<table>
  <my-row>...</my-row>
</table>
```

变通方案：使用`is`属性

```html
<table>
  <tr is="my-row"></tr>
</table>
```

在以下三种情况下使用模板字符串不会受限制

* `<script type="text/x-template">`
* javascript行内模板字符
* `.vue`组件

#### `data`必须是函数

如果直接返回data对象，那么当多次使用一个组件时，这几个组件有可能会共用同一个数据，造成数据污染。

### props

#### 使用`props`来传递数据

* 使用`props`将数据传递到子组件
* 需要在子组件上显式地声明`props`属性
* 如果组件中的属性名是驼峰方式命名的，html中的属性需要是边字符命名的
* 模板语法不受此命名限制
* 可以使用`v-bind`来传递动态属性
* 使用字面量语法传递的数据是`string`类型的，如果要传递特定类型的数据需要使用`v-bind`

```js
Vue.component('child', {
  // declare the props
  props: ['message', 'myMessage', 'dyMessage'],
  // just like data, the prop can be used inside templates
  // and is also made available in the vm as this.message
  template: '<span>{{ message }}</span>'
})
```

父组件通过标签属性的方式传递数据

```html
<input v-model="parentMsg">
<child message="hello!" my-message="hello!" :dyMessage="parentMsg"></child>
```

#### 单向数据流

`prop`在父组件和子组件之间形成了一个单向数据流，当父组件的属性值改变时，会传递到子组件。不可以直接在子组件中修改`props`中的属性值。

如果`props`传递的是引用型数据，那么在子组件中对数据的改变会影响到父组件。

两种特殊情况

1. `props`只用来传递初始值，子组件要将其作为本地属性使用。
2. `props`传递了一个需要被转换的原始值

解决方案

1. 定义一个本地属性，使用`props`的值作为它的初始值

```js
props: ['initialCounter'],
data: function () {
  return { counter: this.initialCounter }
}
```

2. 定义一个计算属性

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

#### `prop`验证

```js
Vue.component('example', {
  props: {
    // basic type check (`null` means accept any type)
    propA: Number,
    // multiple possible types
    propB: [String, Number],
    // a required string
    propC: {
      type: String,
      required: true
    },
    // a number with default value
    propD: {
      type: Number,
      default: 100
    },
    // object/array defaults should be returned from a
    // factory function
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // custom validator function
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

`type`可以是下面的原生构造函数

* String
* Number
* Boolean
* Object 
* Function
* Array
* Symbol

`type`也可以是一个自定义的构造函数，这里会通过`instanceof`来验证

### 非prop属性

* 不在子组件中定义`props`属性，直接将属性传递给子组件
* 属性会赋给子组件的根元素
* `class`和`style`属性会与子组件上的属性合并，其它属性会替代子组件上的属性

### 自定义事件

* 用于子组件通知父组件
* 子组件使用`$.emit()`来发送事件
* 父组件在子组件元素上使用`$.on()`来监听事件

```html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

```js
Vue.component('button-counter', {
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

可以使用`.native`修饰符在子组件的根元素来监听原生事件

```html
<my-component v-on:click.native="doTheThing"></my-component>
```

#### `.sync`修饰符

* 用于`props`属性
* 用来实现父子组件间的双向数据绑定
* 只是语法糖，通过派发事件来改变父组件中属性的值

```html
<comp :foo.sync="bar"></comp>
```

会被扩展为下面的形式

```html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

如果要在子组件中更新`foo`的值，需要手动发送事件

```js
this.$emit('update:foo', newValue)
```

#### `v-model`与组件

`v-model`只是语法糖

```html
<input v-model="something">
```

最终形式为：

```html
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

当`v-model`和组件一起使用时，组件应该

* 接收一个`value``prop`
* 用输入的值触发一个`input`事件

```js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
    </span>\
  ',
  props: ['value'],
  methods: {
    // Instead of updating the value directly, this
    // method is used to format and place constraints
    // on the input's value
    updateValue: function (value) {
      var formattedValue = value
        // Remove whitespace on either side
        .trim()
        // Shorten to 2 decimal places
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // If the value was not already normalized,
      // manually override it to conform
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // Emit the number value through the input event
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

默认情况下，`v-model`使用`value`作为`prop`的名称，但可以在子组件上使用`model`来定义`prop`的名称，这样`value`可以用在其它地方

```js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // this allows using the `value` prop for a different purpose
    value: String
  },
  // ...
})
```

### 使用slot进行内容分发

* 用来进行父组件传入的内容和子组件自身标签的组合
* 使用`<slot>`元素作为插入点

#### 编译作用域

* Everything in the parent template is compiled in parent scope; everything in the child template is compiled in child scope.
* 父组件传入子组件的内容也属于父组件作用域

#### 单个slot

* 子组件中只有一个`<slot>`元素，父组件中所有的内容都会被插入这个位置
* 如果子组件中没有`<slot>`元素，父组件的内容会被丢弃
* `<slot>`元素中的内容是备用的，如果父组件没有传入内容，这些内容会被使用

```html
<!--子组件-->
<div>
  <h2>I'm the child title</h2>
  <slot>
    This will only be displayed if there is no content
    to be distributed.
  </slot>
</div>
```
```html
<!--父组件-->
<div>
  <h1>I'm the parent title</h1>
  <my-component>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </my-component>
</div>
```
```html
<!--结果-->
<div>
  <h1>I'm the parent title</h1>
  <div>
    <h2>I'm the child title</h2>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </div>
</div>
```

#### 具名slot

* 使用`<slot>`的`name`属性给`<slot>`命名
* 在父组件中给要传入的元素添加`slot`属性来插入到指定的位置
* 未命名的`<slot>`是默认的，父组件中没有添加`slot`的元素会插入到这个位置
* 如果没有默认`<slot>`，父组件中没有添加`slot`属性的元素会被丢弃

```html
<!--子组件-->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
```html
<!--父组件-->
<app-layout>
  <h1 slot="header">Here might be a page title</h1>
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>
  <p slot="footer">Here's some contact info</p>
</app-layout>
```
```html
<!--结果-->
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

### 动态组件

* 使用一个挂载点，动态地在几个组件之间进行切换
* 使用`<component>`元素和它的`is`属性，改变`is`属性的值来改变组件
* 如果需要把切换的组件保留在内存时以避免重新渲染，可以在`<component>`元素外加`<keep-alive>`

```js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
//直接使用组件对象
var Home = {
  template: '<p>Welcome home!</p>'
}
var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```
```html
<keep-alive>
  <component :is="currentView">
    <!-- inactive components will be cached! -->
  </component>
</keep-alive>
```

### 子组件引用

* 用于在js中直接操作一个子组件
* 在子组件上添加`ref`属性
* 通过`$refs.name`来引用
* 当和`v-for`一起使用时，返回一个数组
* 只有在渲染完成之后，才能使用

```html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```
```js
var parent = new Vue({ el: '#parent' })
// access child component instance
var child = parent.$refs.profile
```

### 异步组件

通过回调来返回组件

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pass the component definition to the resolve callback
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

和webpack的代码分割特性一起使用

```js
Vue.component('async-webpack-example', function (resolve) {
  // This special require syntax will instruct Webpack to
  // automatically split your built code into bundles which
  // are loaded over Ajax requests.
  require(['./my-async-component'], resolve)
})
```

还可以返回一个`Promise`

```js
Vue.component(
  'async-webpack-example',
  () => import('./my-async-component')
)

new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

还可以返回一个特定格式的对象

```js
const AsyncComp = () => ({
  // The component to load. Should be a Promise
  component: import('./MyComp.vue'),
  // A component to use while the async component is loading
  loading: LoadingComp,
  // A component to use if the load fails
  error: ErrorComp,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

### 组件命名规范

* 使用`PascalCase`来声明组件
* 使用`kebab-case`在html中使用组件

### 递归组件

* 组件调用自身

```js
//这种情况会陷入死循环，所以需要加判断条件
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

### 环式调用组件

* 两个组件互相调用
* 使用`vue.component()`时可以正常工作
* 当使用模块系统引入时，会出现错误
* 需要告诉模块系统，模块A最终需要模块B，模块B没有必要先被解析
* 在`beforeCreate`中引入模块

```html
<!-- tree-folder -->
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
<!-- tree-folder-contents -->
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

```js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

### x-Templates

```html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

```js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

### 静态组件

* 使用`v-once`,只渲染一次，然后缓存起来

```js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```



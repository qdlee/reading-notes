# 正则表达式

## 匹配日期

```js
const str = '20170918';
const pattern = /([0-9]{4})([0, 1]?[1-9]{1})([0-3]?[0-9]{1})/;

const result = str.match(pattern);
console.log(result);
```
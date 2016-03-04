# mockjs

## 开始&安装

npm install mockjs

使用

var Mock = require('mockjs');
var data = Mock.mock({
	//规则
});

## 语法规范

### 数据模板定义规范(DTD)

'name|rule':value

数据模板中的每个属性由3部分构成：属性名、生成规则、属性值
属性名即字段的名称
属性名和生成规则之间用竖线|分隔。
生成规则是可选的

# Storage

属于Web Storage API，支持访问某个特定域中的localStorage和SessionStorage。

浏览器中存储容量大小约为5MB

sessionStorage在浏览器打开期间有效
localStorage在浏览器关闭后依然有效

## 属性

Storage.length(只读)
返回Storage对象中项目的数量，整型。

## 方法

### Storage.key()

传入数字n,会返回storage中第n个key的名称。

### Storage.getItem()

传入key，返回key对应的值。如果key不存在返回null

### Storage.setItem()

传入key和value,将key添加到storage中。如果key已经存在就更新对应key的值。

### Storage.removeItem()

传入一个key,删除对应的key。

### Storage.clear()

清除storage中所有的key。
### 像素-pixel
* px:CSS pixels 逻辑像素，浏览器使用的抽象单位
* dp,pt:device independent pixels 设备无关像素
* dpr:device pixel ratio 设备像素缩放比
dpr = dp/px
* PPI：屏幕每英寸的像素数量，即单位英寸内的像素密度
|               | idpi          | mdpi  | hdpi | xhdpi|
| ------------- |:-------------:| -----:|-----:|-----:|
| ppi           | 120           | 160   |  240 | 320  |
| 默认缩放比    | 0.75          | 1.0   |  1.5 | 2.0  |

### 视口-Viewport
visual viewport
layout viewport

### meta标签
<meta name="viewport" content="name=value,name=value">
<meta name="viewport" content="width=device-width,user-scalable=no">
content的值
width:设置布局viewport的宽度(一般使用“device-width”)
initial-scale:页面的初始缩放
minimum-scale:最少缩放
maximun-scale:最大缩放
user-scalable:用户能否缩放

### 高清图片
图片中的一个像素对应一个dp

### 1像素边框
li:before{
	position:absolute;
	top:-1px;
	left:0;
	border:1px solid #ccc;
	transform:scaleY(.5);
}

### rem单位
相对于html
rem=screen.width/20
文字不要使用rem

### 多行文本溢出
p{
	display:-webkit-box !important;
	overflow:hidden;

	text-overflow:ellipsis;
	word-break:break-all;

	-webkit-box-orient:vertical;
	-webkit-line-clamp:2;
}

### tap事件--自定义事件
移动页面上的click事件响应要慢300ms

自定义事件原理
在touchstart、touchend时记录时间、手指位置，在touchend时进行比较，如果手指位置为同一位置(或允许移动一个非常小的位移值)，且间隔时间较短(一般认为时200ms)，且过程中未曾触发过touchmove即可认为触发了手持设备上的"click",一般称它为"tap"

tap点透的bug
1. 使用缓动动画，过渡300ms的延迟
2. 中间dom元素的加入，让中间层接收这个“穿透”事件，随后隐藏
3. “上下”都使用tap事件，原理上解决(不可避免原生标签的click事件)
4. 改用Fastclick的库










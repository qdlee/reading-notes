//设置元素的透明度
function setOpacity(node, value) {
	if (node.style.opacity === undefined) {
		node.style.filter = "alpha(opacity=" + level + ")";
	} else {
		node.style.opacity = value / 100;
	}
}
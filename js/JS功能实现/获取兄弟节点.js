//下一个兄弟
function get_nextSibling(n) {
	var x = n.nextSibling;
	while (x.nodeType != 1) {
		x = x.nextSibling;
	}
	return x;
}

//上一个兄弟
function get_previousSibling(n) {
	y = n.previousSibling;
	while (y.nodeType != 1) {
		y = y.previousSibling;
	}
	return y;
}


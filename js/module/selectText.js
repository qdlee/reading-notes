function touchCopy (target) {

	var st; //定时器

	// 选择文本
	function selectText(container) {
	  var doc = document,
	      range,
	      selection;

	  if (doc.body.createTextRange) {
	      range = document.body.createTextRange();
	      range.moveToElementText(container);
	      range.select();
	  } else if (window.getSelection) {
	      selection = window.getSelection();
	      range = document.createRange();
	      range.selectNodeContents(container);
	      selection.removeAllRanges();
	      selection.addRange(range);
	  }
	}
	
	// 长按复制功能
	target.on('touchstart',function(e){
	    st = setTimeout(function(){
	      selectText(e.target);
	    },750);
	});
	target.on('touchend',function(e){
	    clearTimeout(st);
	});
}
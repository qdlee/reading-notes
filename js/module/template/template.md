<script type="x/template/answer" id="tmp_ans">
    
</script>

var regexp = /(?:\{\{)([a-zA-z][^\s\}]+)(?:\}\})/g;

var render = function(template,data) {
  
  return template.replace(regexp, function(fullMatch, p2) {
   	if(data[p2]) {
   		return data[p2];
   	} else {
   		return '';
   	}
  });
}
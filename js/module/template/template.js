;(function(){
  /**
   * 模板相关
   */
  var regexp = /(?:\{\{)([a-zA-z][^\s\}]+)(?:\}\})/g;

  var defaultRender = function(template,data) {
    return template.replace(regexp, function(fullMatch, p2) {
      
      if(data[p2]) {
        return data[p2];
      } else {
        return '';
      }
    });
  }

  /**
   * 使用获取的json数据填充模板并插入DOM
   * @param  {[type]} data [json数据]
   */
  function fillData(data,template,container,newRender) {
      var render = newRender || defaultRender; 
      var domStr = '';
      for (var i in data) {
          domStr += render(template, data[i]);
      }
      container.html(domStr);
  }
  window.template = {
    fillData:fillData,
    regexp:regexp
  }
})();
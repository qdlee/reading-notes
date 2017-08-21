$(document).on('keydown',function(e){
  if((e.keyCode || e.which)==13){
    var el = document.activeElement;
    if($(el).hasClass('search')){
      GL.keyword = el.value;
      $('#search')[0].click();
    }
  }
});
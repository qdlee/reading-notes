//倒计时
function countDown (second) {
  function count () {
    if(second<=0){
      $('.count_time').css('display','none');
      $('#finish').data('disable','');
    }else{
      $('.count_time').html(second+'s');
      second--;
      setTimeout(count,1000);
    }
  }
  count();
}
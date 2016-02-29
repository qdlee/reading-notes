function formatMoney (money) {
  var ms =  money.split(''),
      result;

  if(money[money.length-1]>0){
      result = money;
  }else{
    if(money[money.length-2]==0){
      result=money.slice(0,-3);
    }else{
      result=money.slice(0,-1);
    }
  }
  return result;
}
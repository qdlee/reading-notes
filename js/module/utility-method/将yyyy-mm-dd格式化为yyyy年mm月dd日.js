/**
 * 将yyyy-mm-dd格式化为yyyy年mm月dd日
 * @param  {[string]} date [日期字符串]
 * @return {[string]}      [格式化后的日期字符串]
 */
function getDateString(date) {
    var ds = date.split('-');
    var str = '';
    str += ds[0] + '年' + ds[1] + '月';
    if ($('#precision').val() == 1) {
        str += ds[2] + '日';
    }
    return str;
}
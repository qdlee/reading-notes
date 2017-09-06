//将时间戳转换为日期格式yyyy-mm-dd
function toISOString(date) {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate());
}
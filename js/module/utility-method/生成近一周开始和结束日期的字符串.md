/**
 * 生成近一周的开始日期和结束日期的日期字符串并应用到页面中
 */
function calDate() {
    var ed = history.state.end_time || toISOString(new Date());
    var sd = history.state.begin_time || toISOString(new Date(new Date().getTime() - 1000 * 3600 * 24 * 6));
    GL.info = {
        start_date: sd,
        end_date: ed,
        plan_id: 0
    };
    $('.start-date').val(sd);
    $('.end-date').val(ed);
    $('#precision')[0].value = history.state.precision || 1;
}
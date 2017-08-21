/**
 * 根据传入的模块名称构建url地址
 * @param  {[string]} module [模块名称]
 * @return {[string]}        [构建后的url]
 */
function bulidUrl(module) {
    var search = location.search;
    return location.pathname + search.slice(0, search.lastIndexOf('/')) + '/' + module + '.html';
}
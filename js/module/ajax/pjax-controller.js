;(function() {

    var modules = {}; //模块方法
    var container; //pjax容器

    /**
     * 设置pjax容器
     * @param {[Object-DOM]} con [容器对象]
     */
    function setContainer(con) {
        container = con;
    }

    /**
     * 加载模块HTML文件
     * @param  {[string]} url [地址]
     */
    function _loadHTML(state) {
        $.ajax({
            type: "GET",
            url: state.url,
            dataType: "html",
            headers: {
                "X-PJAX": "true"
            },
            success: function(data) {
                container.html(data);
                modules[state.module](state);
            }
        });
    }

    /**
     * 注册模块处理函数
     * @param  {[string]} name    [函数名称]
     * @param  {[Function]} method [函数]
     */
    function _regModule(name, method) {
        modules[name] = method;
    }

    /**
     * 加载指定页面模块--点击时调用
     * @param  {[type]} state [description]
     */
    function loadModule(state) {
        history.pushState(state, '', state.url);
        _loadHTML(state);
    }

    /**
     * 重新加载指定模块-刷新页面和页面第一次加载时调用
     */
    function _reLoadModule() {
        var state = history.state || {};
        if (Object.keys(state).length <= 0) {
            var href = location.href;
            if (href.indexOf('.html') === -1) {
                state.module = href.slice(href.lastIndexOf('/') + 1);
            } else {
                state.module = href.slice(href.lastIndexOf('/') + 1, href.lastIndexOf('.'));
            }
            state.url = location.pathname + location.search;
        }
        history.replaceState(state, '', state.url);
        _loadHTML(state);
    }

    /**
     * 初始化--第一次加载页面和刷新时会调用
     */
    function init(modules) {
        for (var module in modules) {
            _regModule(module, modules[module]);
        }
        _reLoadModule();
    }
    
    /**
     * 监听popstate事件，在事件发生时重新加载页面
     */
    $(window).on('popstate', function(e) {
        _reLoadModule();
    });

    window.pjax = {
        init: init,
        setContainer: setContainer,
        loadModule: loadModule
    };
})();

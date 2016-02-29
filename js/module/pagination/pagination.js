var pagination = (function(maxPage) {

    var loadSpecPage, //加载特定页面处理函数
        pageFirst,
        pageLast,
        pagePrev,
        pageNext;

    /**
     * 将页码添加到分页条中
     * @param {[type]} start  [起始页码数]
     * @param {[type]} end    [终止页码数]
     * @param {[type]} active [当前高亮页码数]
     */
    function setPages(start, end, active) {
        var domStr = '';
        for (var i = start; i <= end; i++) {
            if (i == active) {
                domStr += '<a class="paginate_active page_num">' + i + '</a>'
            } else {
                domStr += '<a class="paginate_button page_num">' + i + '</a>'
            }
        }
        $('#pageNums').html(domStr);
    }

    /**
     * 第一次加载页面时运行
     * 计算页面信息，得出总页数，添加页码项，并显示第一页
     * @param  {[type]} rows  [每页显示行数]
     * @param  {[type]} total [总行数]
     */
    function calPage(rows, total) {
        var pages = Math.ceil(total / rows);
        GL.pages = pages;
        var len = pages > maxPage ? maxPage : pages;
        setPages(1, len, 1);
    }

    /**
     * 改变页面切换按钮的状态，每次重新加载数据时都执行
     */
    function changePageState() {
        pageFirst.removeClass('paginate_button_disabled');
        pagePrev.removeClass('paginate_button_disabled');
        pageLast.removeClass('paginate_button_disabled');
        pageNext.removeClass('paginate_button_disabled');
        var num = $('.paginate_active:first').html();
        if (num == 1 && num == GL.pages) {
            pageFirst.addClass('paginate_button_disabled');
            pagePrev.addClass('paginate_button_disabled');
            pageLast.addClass('paginate_button_disabled');
            pageNext.addClass('paginate_button_disabled');
        } else if (num == 1) {
            pageFirst.addClass('paginate_button_disabled');
            pagePrev.addClass('paginate_button_disabled');
        } else if (num == GL.pages) {
            pageLast.addClass('paginate_button_disabled');
            pageNext.addClass('paginate_button_disabled');
        }
    }

    /**
     * 检查页面切换按钮是否处于可用状态
     * @param  {[type]} target [要检查的按钮]
     * @return {[type]}        [可用：true;不可用：false;]
     */
    function checkState(target) {
        if ($(target).hasClass('paginate_button_disabled')) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 切换页面
     * 不重新加载页面显示，只在当前切换
     */
    function switchPage(target) {
        $('.page_num').each(function() {
            var item = $(this);
            item.attr('class', 'paginate_button page_num');
        });
        $(target).attr('class', 'paginate_active page_num');
    }

    /**
     * 注册页面加载函数
     * @param  {[type]} method 页面加载函数
     */
    function regPageMethod(method) {
        loadSpecPage = method;
    }

    function init () {
        pageFirst = $('#page_first');
        pageLast = $('#page_last');
        pagePrev = $('#page_prev');
        pageNext = $('#page_next');

        $('#pageNums').on('click', function(e) {

            var num = parseInt(e.target.innerHTML);

            if (GL.pages > 5) {
                if (num == 1 || num == GL.pages) {
                    switchPage(e.target);
                } else if (num == 2) {
                    setPages(num - 1, num + 3, num);
                } else if (num == GL.pages - 1) {
                    setPages(num - 3, num + 1, num);
                } else {
                    setPages(num - 2, num + 2, num);
                }
            } else {
                switchPage(e.target);
            }
            loadSpecPage(num);
        });

        pageFirst.on('click', function(e) {
            if (checkState(e.currentTarget)) {
                var end = GL.pages > maxPage ? maxPage : GL.pages;
                setPages(1, end, 1);
                loadSpecPage(1);
            }
        });

        pageLast.on('click', function(e) {
            if (checkState(e.currentTarget)) {
                var pages = GL.pages;
                var start = pages > maxPage ? pages - maxPage+1 : 1;
                setPages(start, pages, pages);
                loadSpecPage(pages);
            }
        });

        pagePrev.on('click', function(e) {
            if (checkState(e.currentTarget))
                $('.paginate_active:first').prev()[0].click();
        });

        pageNext.on('click', function(e) {
            if (checkState(e.currentTarget))
                $('.paginate_active:first').next()[0].click();
        });
    }
    return {
        regPageMethod: regPageMethod,
        calPage: calPage,
        changePageState: changePageState,
        init:init
    }
})(5);

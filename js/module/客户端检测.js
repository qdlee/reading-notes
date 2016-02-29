var browser = {
    versions: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weChat: u.indexOf('MicroMessenger') > -1
        };
    }()
};

// MT.weixintips();
function wechatit() {
    var c;
    if (browser.versions.android) {
        c = "";
    } else if (browser.versions.ios) {
        c = "ios";
    }
    var a = $('<div id="toB"; style="display:none;position: fixed; top: 0; left: 0; width: 100%; z-index: 999; height: 100%; background: rgba(0,0,0,0.5)"></div>');
    var d = '<style>i.tm-wx {display: inline-block; background: url("http://shanshanstatic.b0.upaiyun.com/html/index_files/wx_tips.png") no-repeat; background-size: 61px auto; line-height: 300px; overflow: hidden; height: 27px; width: 48px; margin: 0 5px; vertical-align: middle;}ol li {margin: 12px 0 26px; line-height: 1.4em;}ol li:before {margin-left: -14px;}</style>';
    var e = '<div style="background: #fff; border-radius: 0 0 6px 6px; margin: 0 10px; padding: 15px"><div style="font-size: 18px; margin-bottom: 10px;text-align:left">请用浏览器打开下载：</div><ol style="padding-left: 22px;"><li>点击右上角的<i class="tm-wx" style="background-position: 0 -112px">...</i>或者<i class="tm-wx" style="background-position: 0 -143px">分享</i></li>' + ("ios" !== c ? '<li>选择在浏览器中打开<br><br>即可下载乐取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="tm-wx" style="margin-top:-23px; width: 47px; height: 47px; background-position: 0 -61px;">浏览器</i></li>' : '<li>选择在Safari中打开<br>即可下载乐取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="tm-wx" style="margin-top:-28px;margin-left:10px; width: 61px; height: 61px;">Safari</i></li>') + "</ol>" + '<i class="tm-wx" style="position: fixed; top: 10px; right: 20px; width: 31px; height: 56px; background-position: 0 -175px">右上角</i>' + "</div>";
    a.append(d).append(e).appendTo($('body'));
    $('#toB').click(function() {
        $('#toB').css("display", "none");
    });

    //MicroMessenger
    $(".downlond").on("click",
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#toB').css("display", "block");
        });
};
if (browser.versions.weChat) {
    wechatit();
}
if (browser.versions.android) {
    $("#ios_down").hide();
    $("#and_down").show();
} else if (browser.versions.ios) {
    $("#and_down").hide();
    $("#ios_down").show();
}
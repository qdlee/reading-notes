(function() {
    var docEl = document.documentElement;
    var adjust = function() {
        var width = Math.min(docEl.offsetWidth, 540);
        docEl.style.fontSize = (width/10) + "px";
    };

    addEventListener("resize", function() {
        var timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(adjust, 300);
        };
    }(), false);
    adjust();
}());

(function(){var a=document.documentElement,b=function(){a.style.fontSize=Math.min(a.offsetWidth,540)/10+"px"};addEventListener("resize",function(){var a;return function(){clearTimeout(a);a=setTimeout(b,300)}}(),!1);b()})();
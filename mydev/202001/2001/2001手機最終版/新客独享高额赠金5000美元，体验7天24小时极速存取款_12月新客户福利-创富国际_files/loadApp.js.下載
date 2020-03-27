$.extend({
    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    urlParams: function (key) {
        value = "";
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) value = unescape(r[2]);
        return value;
    },
    loadFromApp: function () {
        var useInfo, type = $.mechined();
        //如果是安卓手机浏览器且是配置的是APP内应用
        var noneHeader = $.urlParams("noneheader"),isLogin=$("#is_login");
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo();//android终端
            } else if (type == 1) useInfo = getInfo();//ios
        }
        //如果从APP获取到的信息不为空，则到后台进行存储
        if (typeof (useInfo) != "undefined") {
            var user = $.parseJSON(useInfo);
            if (typeof (user.account) != "undefined" && (user.account!=null  && user.account!="")) {
                $("#isLogin span").text("入金领赠金");
                $("#isLogin a").attr("href", "https://admin.cfdealer88.com?intercept_deposit");
                isLogin.text("立即交易");
                isLogin.attr("href", "https://admin.cfxdealer.com?intercept_market");
            } else {
                $("#isLogin span").text("开户领赠金");
                $("#isLogin a").attr("href", id_url + "/cn/mobile/rcfd_account"+window.location.search);
                isLogin.text("立即开户");
                isLogin.attr("href", id_url + "/cn/mobile/rcfd_account"+window.location.search);
            }
        } else {
            $("#isLogin span").text("开户领赠金");
            $("#isLogin a").attr("href", id_url + "/cn/mobile/rcfd_account"+window.location.search);
            isLogin.text("立即开户");
            isLogin.attr("href", id_url + "/cn/mobile/rcfd_account"+window.location.search);
        }
    }
});

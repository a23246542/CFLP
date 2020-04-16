
    $(".left-btn").click(function () {
        if($.isLogin()){
            $("#shareLink").html(localStorage.getItem("link"))
            $(".copyPopup").show()
        }else{
            $("#loginKuang").show();
        }

    });


$.extend({
    JsonpAjax: function (url, options, callbackSuc, callbackErr) {
        $.extend(options, {_r: Math.random()});
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            data: options,
            dataType: "jsonp",// 数据类型为jsonp
            jsonp: 'jsonpCallback',
            beforeSend: function () {
                $("#loading").html("<img src='https://m.cf139.com/static/img/jiazai.gif' />"); //在后台返回success之前显示loading图标
            },
            success: function (data) {
                //console.log(data);
                $("#loading").hide();
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                $("#loading").hide();
                console.log("请求失败，url :" + url);
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });

    },
    //通用ajax请求
    ajaxk: function (type, url, options, callbackSuc, callbackErr) {
        $.ajax({
            type: type,
            url: url,
            async: false,
            data: options,
            dataType: "json",// 数据类型为jsonp
            //jsonp:'jsonpCallback',
            success: function (data) {
                //console.log(data);
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                console.log("请求失败，url :" + url);
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });
    },
    postAjax: function (url, options, callbackSuc, callbackErr) {
        $.extend(options, {url: Math.random()});
        $.ajaxk("POST", url, options, callbackSuc, callbackErr);
    },
    getAjax: function (url, callbackSuc, callbackErr) {
        $.extend(options, {url: Math.random()});
        $.ajaxk("GET", url, "", callbackSuc, callbackErr);
    },

    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    //获取cookie
    cookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    //获取url中的参数
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },

    //是否登陆
    isLogin: function () {
        var cookieLogin = localStorage.getItem("login");//获取名称为“key”的值

        // console.log(cookieLogin);
        if (cookieLogin == null || cookieLogin == "") {
            //弹出登录框
            return false;
        }
        return true;
    },
    //登录
    login: function () {
        $("#loading").show();
        // var mis_url = "http://mis.cf860.com";
        var mis_url = "https://mis.cf139.com";
        var url = mis_url + "/cfd/fxlogin";
        var options = {
            /* customerNumber:"81015540",
             password:"ct170424",*/
            customerNumber: $("#phone").val(),
            password: $("#upwd").val(),
            platform: "GTS2",
            actId: "1"
        };
        $.JsonpAjax(url, options, function (data) {
            if (data.code == 200) {
                localStorage.setItem("login","login");//以“key”为名称存储一个值“value”
                // $.cookie("login", "login");
                $("#loginKuang").hide();
                //加密账号 手机号
                customerTel = data.ch_msg.phoneCode;
                customerNo = data.ch_msg.customerCode;
                var shareLink = "https://m.cf139.com/cn/zt/referral/share.html?utm_source=company&utm_medium=Data%20contrast&utm_campaign=tuijian2&code=" + customerTel
                localStorage.setItem("link",shareLink);
                localStorage.setItem("numberCode",customerNo)
                $("#shareLink").html(localStorage.getItem("link"))
            } else {
                $(".error-info").show().html(data.ch_msg);
            }
        });
    }
})


    var clipboard = new Clipboard('.bds_copy',{
        text:function () {
            return localStorage.getItem("link")
        }
    })
    clipboard.on('success', function(e) {
        alert("复制成功");
        e.clearSelection();
    });

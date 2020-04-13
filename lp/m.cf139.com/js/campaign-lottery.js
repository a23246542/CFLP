var bRotate = false;
var actId = 3;
var money = {500:"88.88", 200:"20.88", 100:"10.88", 50:"5.88", 10:"2.88",谢谢参与:"0.88"};
//var mis_url = "http://mis.cf860.com";
$.extend({
    ajaxData: function (options, callbackSuc, callbackErr) {
        options = $.extend(options, {"_r": Math.random()});
        $.ajax({
            type: options.ajaxtype,
            url: options.url,
            async: true,
            data: options,
            dataType: "json",//数据类型为jsonp
            success: function (data) {
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });
    },
    jsonpAjax: function (options, callbackSuc, callbackErr) {
        $.extend(options, {_r: Math.random()});
        var jsonPUrl = options.url;
        $.ajax({
            type: "GET",
            url: jsonPUrl,
            async: true,
            data: options,
            dataType: "jsonp",// 数据类型为jsonp
            jsonp: 'jsonpCallback',
            success: function (data) {
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                console.log("请求失败，url :" + options.url);
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });

    },
    //get提交加载
    loadingGet: function (param, callbackSuc, callbackErr) {
        param = $.extend(param, {"ajaxtype": "GET"});
        $.jsonpAjax(param, callbackSuc, callbackErr);
    },
    //post提交加载
    loadingPost: function (param, callbackSuc, callbackErr) {
        param = $.extend(param, {"ajaxtype": "POST"});
        $.jsonpAjax(param, callbackSuc, callbackErr);
    },
    initLuckyLottery: function () {
        //初始用户是否登陆,主要是针对app，保证app登陆了，h5就不用登陆
        $.initLogined();
        //登陆操作
        $(".clickLogin").click(function () {
            $.loginTurn();
        });
        //中奖记录
        $(".prize").click(function () {
            $("body,html").css("overflow", "hidden");
            $.record();
        });
        //跑马灯
        $.paoma();
    },
    setCookie: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = $.getCookie(name);
        var domain = mis_url.replace(/(http|https):\/\/mis./, "");
        alert(cval);
        if (cval != null)
            document.cookie = name + "=" + cval + ";domain=" + domain + ";path=/;expires=" + exp.toGMTString();
        alert($.getCookie(name));
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    initLuckyUser: function (data) {
        if (data.code == 200) {
            data = data.ch_msg[0];
            $.luckyProp(data);
            $(".lotteryStart").click(function () {
                if ($.getCookie("actlucky") == null) {
                    $.showlogin();
                    return;
                }
                else {
                    $.accStatus(data);
                }

            });
        } else {
            alert(data.ch_msg[0]);
        }
    },
    luckyProp: function (data) {
        var time = data.leftTime;
        if (data.customerNo == 0) {
            $(".user").html("请先<a href='javascript:void(0)' style='color: #f7ee01;text-decoration: underline;' onclick=\"$.showlogin()\">登陆账号</a>（限已激活用户）");
        } else {
            if (data.leftTime > 0) {
                $.timeElapse(time);
            } else {
                $(".user").html("您今天还可以抽奖 <span>" + data.turnTimes + "</span> 次！");
            }
        }
    },
    rotateFn: function (data) {
        //如果已经登陆了
        if (data.prizeId != -2) {
            if (!bRotate) {
                bRotate = !bRotate;
                $.clickTurn();
            }
        } else {
            if (!bRotate) {
                $.showlogin();
            }
            bRotate = !bRotate;
        }
    },
    clickTurn: function () {
        var param = {"url": mis_url + "/public/lucky/turn/" + actId};
        $.loadingPost(param, function (data) {
            $.ajaxTurn(data)
        }, function (data) {
            console.info(data);
        });
    },
    ajaxTurn: function (data) {
        if (data.code == 200) {
            data = data.ch_msg[0];
            //如果有中奖，则根据返回的角度进行转动
            if (data.prizeId >= 0) {
                $(".lotteryCon").removeClass("rotate");
                $('.lotteryCon').stopRotate();
                $('.lotteryCon').rotate({
                    angle: 0,
                    animateTo: data.angle + 1040,
                    duration: 3000,
                    callback: function () {
                        bRotate = !bRotate;
                        var turnTimes = data.turnTimes;
                        turnTimes = turnTimes > 0 ? turnTimes - 1 : 0;
                        $(".user span").html(turnTimes);
                        $("#suc .layout span").empty().html(data.prizeName+"美元");
                        $("#suc").show();
                    }
                });
                return;
            }
            //如果后台返回的提示中没有登陆
            else if (data.prizeId == -2)
                $.showlogin();
        } else {
            alert(data.code_desc);
        }
        bRotate = !bRotate;
    },
    loginTurn: function () {
        if (!$.checkInput()) return;
        var options = {
            customerNumber: $.trim($("#phone").val()),
            password: $.trim($("#upwd").val()),
            platform: "GTS2",
            actId: actId,
            url: mis_url + "/cfd/fxlogin"
        };
        $.jsonpAjax(options, function (data) {
            if (data.code == 200) {
                var phone = $.trim($("#phone").val());
                if (phone.length==8&&phone.charAt(0)==1){
                    $(".error-info").show().html("抽奖活动暂不支持模拟账号，请登录真实账号进行抽奖");
                }else{
                    window.location.reload(true);
                }
            } else {
                $(".sub_error .error-info").show().html("账号或密码错误");
            }
        }, function () {});
    },
    checkInput: function () {
        var phone = $.trim($("#phone").val());
        if (phone.length <= 0) {
            $(".phone-tip").html("账户或手机号不能为空");
            return false;
        } else $(".phone-tip").empty();
        var upwd = $.trim($("#upwd").val());
        if (upwd.length <= 0) {
            $(".upwd-tip").html("密码不能为空");
            return false;
        } else $(".upwd-tip").empty();
        return true;
    },
    record: function () {
        var param = {"url": mis_url + "/public/lucky/record/" + actId};
        $.loadingPost(param, function (data) {
            if (data.code == 200) {
                data = data.ch_msg.reverse();
                var html = "", total = "", num = "";
                if (data.length <= 0) {
                    html += " <li><p>无记录</p></li>";
                } else{
                    data.forEach(function (item, index) {
                        var prizeName = item.prizeName.replace("美元", "").replace("$", "");
                        total += Number(prizeName);
                        total = Number(total);
                        num = index + 1;
                        html +=
                            "<li><div class='item'>\n" +
                            "       <span class=\"num\">" + num + "</span>\n" +
                            "       <p>抽中</p>\n" +
                            "       <div class=\"money\"><span>$" + prizeName + "</span></div>\n" +
                            "       <p>赠金</p></div>\n" +
                            "       <div class='item'><time>" + item.time + "</time></div>\n" +
                            "  </li>";
                    });
                }
                $("#record").show();
                $("#record .conList ul").empty().append(html);
                $("#total").empty().html("$"+total.toFixed(2));
                $("#num").empty().html(num)
            } else if (data.code == 500) {
                $.showlogin();
            }
        }, function (data) {
            console.info(data);
        });
    },
    paoma: function () {
        var param = {"url": mis_url + "/public/lucky/users/" + actId};
        $.loadingPost(param, function (data) {
            if (data.code == 200) {
                data = data.ch_msg;
                var html = "";
                if (data.length <= 0) {
                    html += " <li><p>无记录</p></li>";
                } else{
                    data.forEach(function (item) {
                        var prizeName= item.prizeName.replace("$","").replace("美元","");
                        html += "  <li><p>恭喜 " + item.customerNo + " 抽中了 <span>" + money[prizeName] + " 美元</span><p></li>";
                    });
                }
                $(".marquee ul").empty().append(html);
                $(".m-page").slide({mainCell:".marquee ul",autoPage:true,effect:"topLoop",autoPlay:true,vis:2})
            }
        }, function (data) {
            console.info(data);
        });
    },
    timeElapse: function (second) {
        second = second / 1000;
        if (second > 0) {
            var day = Math.floor(second / (3600 * 24));
            $(".user").html("距离活动开始还有 <span>" + day + "</span> 天");
        }
    },
    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    showlogin: function () {
        var noneHeader = $.urlParams("noneheader"), type = $.mechined();
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type != -1)
                window.location.href = "intercept_login";
            else  {
                $("#loginKuang").show();
                $("body").css("overflow", "hidden");
            }
        } else {
            $("#loginKuang").show();
            $("body").css("overflow", "hidden");
        }
    },
    //检测app自动登陆实现
    initLogined: function () {
        //"actlucky:"+$.getCookie("actlucky"));
        $.loadFromApp();
    },
    loadFromApp: function () {
        var useInfo, type = $.mechined();
        //如果是安卓手机浏览器且是配置的是APP内应用
        var noneHeader = $.urlParams("noneheader");
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo();//android终端
            } else if (type == 1) useInfo = getInfo();//ios
        }
        if (typeof (useInfo) !== "undefined")//如果从APP获取到的信息不为空，则到后台进行存储
        {
            var user = $.parseJSON(useInfo);
            if (typeof (user.account) != "undefined") {
                $.loginedByAccout(user);
            } else {
                $.actTurner();
            }
        } else $.actTurner();
    },
    actTurner: function () {
        //转到转盘操作
        var param = {"url": mis_url + "/public/lucky/times/" + actId};
        $.loadingPost(param, function (data) {
            $.initLuckyUser(data)
        }, function (data) {
            console.info(data);
        });
    },
    loginedByAccout: function (appUserInfo) {//自动登陆
        appUserInfo = $.extend(appUserInfo, {"url": mis_url + "/public/lucky/logined/" + actId});
        $.jsonpAjax(appUserInfo, function (data) {
            console.log(data);
            $.actTurner();
        }, function (data) {
            console.log(data);
            $.actTurner();
        });
    },
    urlParams: function (key) {
        value = "";
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) value = unescape(r[2]);
        return value;
    },
    accStatus:function (data) {
        var options = {"url": mis_url + "/public/customer/act/" + data.customerNo};
        $.jsonpAjax(options, function (data) {
            if (data.code == 200) {
                data = data.ch_msg;
                if (data.length>0) {
                    if (typeof (data[0].activetime) == "undefined"||data[0].activetime=="") {
                        $("#deposit").show();
                        if(window.screen.width <= 750){
                            var hg = $("#main").height();
                            var hg1_c = $("#deposit .m-tcCon").height(), result1 = (hg - hg1_c) / 2;
                            $("#deposit .m-tcCon").css("top", result1);
                        }
                    }else{
                        $.rotateFn(data);
                    }
                } else {
                    $("#deposit").show();
                    if(window.screen.width <= 750){
                        var hg = $("#main").height();
                        var hg1_c = $("#deposit .m-tcCon").height(), result1 = (hg - hg1_c) / 2;
                        $("#deposit .m-tcCon").css("top", result1);
                    }
                }
            }
        })
    }
});

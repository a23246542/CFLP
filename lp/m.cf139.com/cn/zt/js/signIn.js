var oldTime = ["廿九", "除夕", "春节", "初二", "初三", "初四", "初五"];
var use="";
window.getInfoCallback = function (info) {
    $.getInfoCallback(info);
};
$.extend({
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
    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    urlParams: function (key) {
        var value = "";
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) value = unescape(r[2]);
        return value;
    },
    /*打卡*/
    clickSignIn: function () {
        var noneHeader = $.urlParams("noneheader");
        $.initRed("");
        $.initList();
        $("#atOnce").click(function () {
            if (noneHeader == null || $.trim(noneHeader).length <= 0) {
                $("#download").css("display", "flex");
                $.downApp()
            } else {
                $.initSignIn();
            }
        })
    },
    loginApp: function () {
        var useInfo = "", type = $.mechined(), noneHeader = $.urlParams("noneheader");
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo();//android终端
            } else if (type == 1) {
                window.webkit.messageHandlers.getInfo.postMessage("");
                useInfo = JSON.stringify(use);//ios
            }
        }
        return useInfo;
    },
    /*app调用函数*/
    getInfoCallback: function (info) {
        use = info
    },
    /*打卡*/
    initSignIn: function () {
        var param = $.extend($.loginApp(), {"url": mis_url + "/public/ding/today"});
        $.loadingPost(param, function (res) {
            $.tipInfo(res, 0)
        });
    },
    /*打卡记录与红包详情*/
    initList: function (type, val) {
        var noneHeader = $.urlParams("noneheader"), user;
        if (noneHeader !== null && $.trim(noneHeader).length > 0) user = $.loginApp();
        var param = $.extend(user, {"url": mis_url + "/public/ding/list"});
        var ding, red, time, start, end, html = '', timeVal, dingTime = [], checked, num, sign = $("#sign"), totel, types, missLen;
        $.loadingPost(param, function (res) {
            if (res.code == 200) {
                ding = res.ch_msg[0].ding, red = res.ch_msg[0].red, time = res.ch_msg[0].time, start = res.ch_msg[0].start, end = res.ch_msg[0].end;
                num = time - start;
                for (var i = 0; i < 7; i++) {
                    if (i <= num) {
                        timeVal = Number(start) + i;
                        for (var k = 0; k < ding.length; k++) {
                            if (timeVal == ding[k].dingTime) {
                                dingTime.push(timeVal)
                            }
                        }
                        for (var j = 0; j < dingTime.length; j++) {
                            if (dingTime.length < 6) {
                                if (dingTime[j] == timeVal) totel = i
                            }
                        }
                        if (dingTime.indexOf(timeVal) > -1) {
                            checked = "checked";
                        } else {
                            checked = "miss";
                        }
                        if (i == num) {
                            if (ding.length > 0) {
                                if (dingTime.indexOf(timeVal) > -1) {
                                    checked = "checked";
                                } else {
                                    checked = "";
                                }
                            } else checked = "";
                        }
                    } else checked = "";
                    html += '<li class="' + checked + '">\n' +
                        '       <img class="gift" src="' + img_url + '/source/www/zt/lp-img/mobile/signIn/gift.png"/>\n' +
                        '       <div class="item"><span>' + (i + 1) + '</span><i><img src="' + img_url + '/source/www/zt/lp-img/mobile/signIn/Checkmark.png"/></i></div>\n' +
                        '       <p>' + oldTime[i] + '</p>\n' +
                        '  </li>';
                }
                sign.empty().append(html);
                $.initRed(red);
                missLen = $(".miss").length;
                if (time == start && missLen == 0) {
                    sign.find("li:eq(0) .gift").addClass("block");
                    sign.find("li:eq(4) .gift").addClass("block");
                    sign.find("li:eq(6) .gift").addClass("block");
                } else {
                    if (ding.length == 0) sign.find("li:eq(" + missLen + ") .gift").addClass("block");
                    if (missLen == 0) {
                        sign.find("li:eq(" + (4 + missLen) + ") .gift").addClass("block");
                        sign.find("li:eq(" + (6 + missLen) + ") .gift").addClass("block");
                    } else if (missLen == 1) {
                        sign.find("li:eq(" + (4 + missLen) + ") .gift").addClass("block");
                    } else {
                        sign.find("li:eq(" + (4 + missLen) + ") .gift").addClass("block");
                    }
                    if (dingTime[0] >= start) {
                        num = dingTime[0] - start;
                        sign.find("li:eq(" + num + ") .gift").addClass("block");
                    }
                    if (dingTime.length >= 5 && dingTime.length < 7) {
                        sign.find("li:eq(" + totel + ") .gift").addClass("block");
                    }
                    if (dingTime.length >= 7) {
                        sign.find("li:eq(4) .gift").addClass("block");
                        sign.find("li:eq(6) .gift").addClass("block");
                    }
                }
                $.minOpenClass(red);
                if (dingTime.length == 1) types = 1;
                else if (dingTime.length == 5) types = 2;
                else if (dingTime.length == 7) types = 3;
                $.bigOpenClass(red, types);
                if (val == "min") {
                    $(".openClass:eq(" + (type - 1) + ")").addClass('open');
                    $(".openClass:eq(" + (type - 1) + ")").find(".money span").empty().text(red[type]);
                } else if (val == "big") {
                    $("#redPop .bgRed").css({"top":".5rem","left":".25rem"});
                    $("#redPop .bgRed").find(".bgFace").hide();
                    $("#redPop .bgRed").find(".bgBack").show();
                    $("#redPop .bgRed").find(".backClose").show();
                    $("#redPop .bgRed").find("#moneyPop").empty().text(red[type])
                }
            } else {
                sign.find("li:eq(0) .gift").addClass("block");
                sign.find("li:eq(4) .gift").addClass("block");
                sign.find("li:eq(6) .gift").addClass("block");
            }
        });
    },
    /*初始化红包*/
    initRed: function (data) {
        var redHtml = '', open, day;
        for (var j = 1; j <= 3; j++) {
            open = data[j] > 0 ? " open" : '';
            if (j == 1) day = 1;
            else if (j == 2) day = 5;
            else if (j == 3) day = 7;
            redHtml += '<li class="openClass' + open + '">\n' +
                '           <div class="face">\n' +
                '               <img src="' + img_url + '/source/www/zt/lp-img/mobile/signIn/pic' + j + '.png"/>\n' +
                '               <a>' + day + '天解锁</a>\n' +
                '           </div>\n' +
                '           <div class="back">\n' +
                '               <div class="money"><span>' + data[j] + '</span><p>元</p></div>\n' +
                '               <a>已领取</a>\n' +
                '           </div>\n' +
                '      </li>'
        }
        $("#redEnvelope").empty().append(redHtml);
    },
    /*拆包*/
    openRed: function (type, val) {
        var param = $.extend($.loginApp(), {"url": mis_url + "/public/ding/open", "type": type});
        $.loadingPost(param, function (res) {
            $.tipInfo(res, 1, type, val)
        });
    },
    /*小红包点击拆包*/
    minOpenClass: function (data) {
        $(".openClass").click(function () {
            var indx = $(".openClass").index($(this)) + 1;
            if (data[indx] == 0) {
                $.openRed(indx, "min");
            } else if (data[indx] == -1) $.openRed(indx);
        })
    },
    /*大红包点击拆包*/
    bigOpenClass: function (data, type) {
        $("#redPop .bgFace").click(function () {
            if (data[type] == 0) {
                $.openRed(type, "big");
            }
        })
    },
    /*提示*/
    tipInfo: function (res, num, type, val) {
        if (res.code == 200) {
            if (num == 0) {
                var open = res.open;
                if (open >= 1) {
                    $("#redPop").css("display", "flex");
                    $.pop("#redPop",".bgRed")
                }
                $.initList();
            } else if (num == 1) {
                $.initList(type, val)
            }
        } else if (res.code == 1000) {
            if (num == 1) $("#redPop").hide();
            $("#real").css("display", "flex");
            $("#real .message").empty().text("没有找到您想拆的红包")
            $.pop("#real",".bgColor")
        } else if (res.code == 1001) {
            if (num == 1) $("#redPop").hide();
            $("#real").css("display", "flex");
            $("#real .message").empty().text("请登陆真实账号再操作")
            $.pop("#real",".bgColor")
        } else if (res.code == 1002) {
            if (num == 1) $("#redPop").hide();
            $("#activation").css("display", "flex");
            $("#activation .message").empty().text("请入金激活之后再操作")
            $.pop("#activation",".bgColor")
        } else if (res.code == 1003) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("活动已结束，请于2月2日 23:59 之前及时领取红包奖励")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1004) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("活动尚未开始，请于1月23日 00:00 之后开始签到")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1006) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("领取出现异常，请稍后重试或联系客服")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1007) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("您今天已签到，到1月29日每天能签到1次")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1008) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("您已经领过此红包了")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1009) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("您不在参与此活动的名单中")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1010) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("领取失败，红包已过期")
            $.pop("#tip",".bgColor")
        } else if (res.code == 1011) {
            if (num == 1) $("#redPop").hide();
            $("#real").css("display", "flex");
            $("#real .message").empty().text("模拟账户和游客不能操作，请切换真实账户")
            $.pop("#real",".bgColor")
        } else if (res.code == 1012) {
            if (num == 1) $("#redPop").hide();
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text("累积签到天数未达到解锁条件，请再接再厉")
            $.pop("#tip",".bgColor")
        }else {
            $("#tip").css("display", "flex");
            $("#tip .message").empty().text(res.code_desc)
            $.pop("#tip",".bgColor")
        }
    },
    /*下载*/
    downApp: function () {
        var type = $.mechined();
        $("#download .download").click(function () {
                if (type == 0) {
                    window.location.href = "https://sc.tfejy.com/source/material/CFD_APP.apk"
                } else if (type == 1) {
                    window.location.href = "https://itunes.apple.com/us/app/chuang-fucfd/id1153506842?mt=8"
                }
            }
        )
    },
    /*弹窗*/
    pop:function (val,type) {
        var clientWidth = document.body.clientWidth||document.documentElement.clientWidth;
        var clientHeight = document.body.clientHeight||document.documentElement.clientHeight;
        var boxWidth = $(""+val+" "+type+"").width();
        var boxHeight = $(""+val+" "+type+"").height();
        $(""+val+" "+type+"").css({"top":(clientHeight-boxHeight)/2+"px","left":(clientWidth-boxWidth)/2+"px"})
    }
});

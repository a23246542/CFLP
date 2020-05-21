window.getInfoCallback = function (info) {
    $.getInfoCallback(info)
};
var use = "", interestId = 9;
$.extend({
    jsonAjax: function (options, callbackSuc, callbackErr) {
        $.extend(options, {_r: Math.random()});
        $.ajax({
            type: options.ajaxtype,
            url: options.url,
            async: true,
            data: options,
            dataType: "json",
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
        $.jsonAjax(param, callbackSuc, callbackErr);
    },
    //post提交加载
    loadingPost: function (param, callbackSuc, callbackErr) {
        param = $.extend(param, {"ajaxtype": "POST"});
        $.jsonAjax(param, callbackSuc, callbackErr);
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
    /*app调用函数*/
    getInfoCallback: function (info) {
        if (typeof (info.account) == "undefined" || info.account == "" || info.account == null) {
            $("#real").css("display", "flex");
            $.clickSignUp(-1)
        } else $.initSignUp(info.account);
    },
    loginApp: function () {
        var useInfo = "", type = $.mechined(), noneHeader = $.urlParams("noneheader");
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo();//android终端
                if (typeof ($.parseJSON(useInfo).account) == "undefined" || $.parseJSON(useInfo).account == "" || $.parseJSON(useInfo).account == null) {
                    $("#real").css("display", "flex");
                    $.clickSignUp(-1)
                } else $.initSignUp($.parseJSON(useInfo).account);
            } else if (type == 1) {
                if (typeof (window.getInfo) !== "undefined") {
                    useInfo = window.getInfo();//ios
                    if (typeof ($.parseJSON(useInfo).account) == "undefined" || $.parseJSON(useInfo).account == "" || $.parseJSON(useInfo).account == null) {
                        $("#real").css("display", "flex");
                        $.clickSignUp(-1)
                    } else $.initSignUp($.parseJSON(useInfo).account);
                } else {
                    window.webkit.messageHandlers.getInfo.postMessage("");
                }
            }
        }else $.clickSignUp(0)
    },
    clickSignUp: function (type, data, interestStatus) {
        $("#signUp").click(function () {
            if (type == 0) {
                $("#download").css("display", "flex");
            } else if (type == -1) {
                $("#real").css("display", "flex");
            } else if (type == 1) {
                if ($("#signUp").attr("name") == "signUp") $.userInterestList(data);
                else $.addInterest(data)
            } else if (type == 2) {
                $("#tip").css("display", "flex");
                if (interestStatus == 2) $("#tip .message").empty().text("活动已停用");
                if (interestStatus == 3) $("#tip .message").empty().text("活动已结束");
            } else if (type == 3) {
                $.userInterestList(data);
            }
        })
    },
    initSignUp: function (account) {
        var noneHeader = $.urlParams("noneheader"), useInfo, data;
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            data = {
                customerNo: account,
                interestId: interestId
            };
            $.authInterest(data)
        } else {
            $.clickSignUp(0)
        }
    },
    authInterest: function (data) {
        var param = $.extend(data, {"url": "https://precrs.cf139.com/api/interest/activity/authInterest"});
        $.loadingPost(param, function (res) {
            if (res.code == 0) {
                if (res.data.authStatus == true) {
                    if (res.data.interestStatus == 1 || res.data.interestStatus == 3) {
                        $("#signUp").empty().text("我的收益");
                        $("#signUp").attr("name", "signUp");
                        $.userInterestList(data);
                        $.clickSignUp(3, data);
                    } else {
                        $.clickSignUp(2, data)
                    }
                } else {
                    if (res.data.interestStatus == 1) $.clickSignUp(1, data);
                    else $.clickSignUp(2, data, res.data.interestStatus)
                }
            } else if (res.code == 10032){
                $("#real").css("display", "flex");
                $("#real .message").empty().text(res.msg);
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.msg);
            }
        });
    },
    addInterest: function (data) {
        var param = $.extend(data, {"url": "https://precrs.cf139.com/api/interest/activity/addInterest"});
        $.loadingPost(param, function (res) {
            if (res.code == 0) {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text("您已报名成功！");
                $("#signUp").empty().text("我的收益");
                $("#signUp").attr("name", "signUp");
            }  else if (res.code == 10032){
                $("#real").css("display", "flex");
                $("#real .message").empty().text(res.msg);
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.msg);
            }
        })
    },
    userInterestList: function (data) {
        var param = $.extend(data, {"url": "https://precrs.cf139.com/api/interest/activity/userInterestList"});
        var html = "", txt, time, total = parseFloat(0), income = $("#income");
        $.loadingGet(param, function (res) {
            if (res.code == 0) {
                income.css("display", "flex");
                if (res.data.length <= 0) {
                    income.find(".pop-tit span").empty().text("直接暂无利息");
                    income.find(".popItem ul").empty();
                    income.find(".popItem i").empty();
                    income.find(".popItem span").css("margin-top", "0")
                } else {
                    for (var i in res.data) {
                        if (res.data[i].status == 1) {
                            txt = "收益<em>" + res.data[i].systemMoney + "</em>美元利息";
                            total += parseFloat(res.data[i].systemMoney)
                        } else txt = "未达标";
                        time = $.dateFormatFull(res.data[i].statisticsDate);
                        html += '<li><p>' + time + '</p><p>' + txt + '</p></li>'
                    }
                    income.find(".popItem ul").empty().append(html);
                    income.find(".pop-tit em").empty().append(total.toFixed(2));
                }
            } else if (res.code == 10032){
                $("#real").css("display", "flex");
                $("#real .message").empty().text(res.msg);
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.msg);
            }
        })
    },
    dateFormatFull: function (longTypeDate) {
        var dateType = "";
        var date = new Date();
        date.setTime(longTypeDate);
        dateType = date.getFullYear() + "." + this.getFullPart(date.getMonth() + 1) + "." + this.getFullPart(date.getDate());
        return dateType;
    },
    getFullPart: function (day) {
        return day < 10 ? "0" + day : day;
    }
});
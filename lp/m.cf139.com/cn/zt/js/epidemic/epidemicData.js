﻿var oldTime = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]
var actId = 100, noneHeader, checkRed, use = "", newCallback, initCallback;
window.getInfoCallback = function (info) {
    //有登入的話initCallback=0
    $.getInfoCallback(info);
    // /*app调用函数*/
    // getInfoCallback: function (info) {
    //     if ($.isEmpty(info.account)) {
    //         $("#real").css("display", "flex");
    //     } else {
    //         initCallback = 0;
    //         $.initList(-1, info);
    //     }
    // },
};
// =======
// 有呼叫initList的地方
// 1.一進來的時候
// 2.clickSignIn 點擊簽到可是找不到呼叫在哪
// 3.initSignIn 初始畫遷到的地方 第一次開始點擊遊戲開始會給0 不是第一次開始不給東西
// 4.關閉遊戲視窗 呼叫一次沒給東西
// 5.拆紅包api成功會給1
// 6.$.winningRule();

// (h5直接呼叫)clickSignIn>app有就呼叫intList+ 點擊簽到呼叫initSignIn
//app getinfo有東西 就newCallboak=-1 有先呼叫initList 沒東西是0
// 一按"簽到"initCallback就變-1 並呼叫initSingin
$.extend({
    jsonpAjax: function (options, callbackSuc, callbackErr) {
        $.extend(options, {_r: Math.random()});
        $.ajax({
            type: "GET",
            url: options.url,
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
    /*判断机型*/
    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    /*URL参数*/
    urlParams: function (key) {
        var value = "";
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) value = unescape(r[2]);
        return value;
    },
    /*时间格式*/
    dateFormatFull: function (longTypeDate) {
        var dateType = "";
        var date = new Date();
        date.setTime(longTypeDate);
        dateType = date.getFullYear() + "." + this.getFullPart(date.getMonth() + 1) + "." + this.getFullPart(date.getDate());
        return dateType;
    },
    getFullPart: function (day) {
        return day < 10 ? "0" + day : day;
    },
    isEmpty: function (str) {
        return typeof (str) == "undefined" || str === '' || str == null;
    },
    dataTime: function (data) {
        var html = "", month, blankData = ["", "", ""], blankEndData = ["", ""], newTime, checkInTime = '',
            dingTime = "", checkData = [], checked;
        month = new Date().getMonth() + 1;
        if (Number(month) == 4) {
            newTime = blankData.concat(oldTime, blankEndData)
        }
        for (var i in newTime) {
            if (data && data.length > 0) {
                for (var j in data) {
                    checkInTime = data[j].dingTime.toString();
                    if (checkInTime.slice(checkInTime.length - 2, checkInTime.length - 1) == 0) {
                        dingTime = checkInTime.slice(checkInTime.length - 1, checkInTime.length);
                    } else {
                        dingTime = checkInTime.slice(checkInTime.length - 2, checkInTime.length);
                    }
                    if (newTime[i] == dingTime) {
                        checkData.push(newTime[i])
                    }
                }
                if (checkData.indexOf(newTime[i]) > -1) {
                    checked = "checked";
                } else {
                    checked = "";
                }
            } else {
                checked = "";
            }
            html += '<li class="' + checked + '"><span>' + newTime[i] + '</span><em></em></li>'
        }
        if (checkData.length > 0) $("#title").empty().html("已累计签到 <em>" + checkData.length + "</em> 天");
        else $("#title").empty().text("一起战疫 坚持打卡");
        $("#dataTime").empty().append(html);
    },
    /*点击签到*/
    clickSignIn: function () {
        noneHeader = $.urlParams("noneheader");
        var type = $.mechined();
        if (noneHeader == null || $.trim(noneHeader).length <= 0) {
            $.dataTime();
            $.startGame();
            $.winningRule();
            $("#atOnce").click(function () {
                $("#download").css("display", "flex");
                $.pop("#download", ".m-popCon")
            })
        } else {
            //判斷都是app開啟給(然後app開啟一定是登入??) new=-1
            //newCallback 登入app = -1 還沒登入app=0
            if (type == 0 && typeof (uiObject) !== "undefined") {
                newCallback = -1;
            } else if (type == 1) {
                if (typeof (window.getInfo) !== "undefined") {
                    newCallback = -1;
                } else {
                    newCallback = 0;
                    window.webkit.messageHandlers.getInfo.postMessage("");
                }
            }
            //是-1就初始化簽到記錄根紅包詳情
            //不對應該是app getinfo有東西 就newCallboak=-1 可直接呼叫initList
            if (newCallback == -1) $.initList();//如果都是
            $.closeGamePop();
            $.winningRule();
            $("#atOnce").click(function () {
                initCallback = -1;
                $.initSignIn();
            })
        }
    },
    /*登录*/
    login: function () {
        var useInfo = "", type = $.mechined();
        //noneheader就確定是app進去 要嘛0 安卓 要嘛1ios
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo();//android终端
            } else if (type == 1) {
                if (typeof (window.getInfo) !== "undefined") {
                    useInfo = window.getInfo();
                } else {
                    window.webkit.messageHandlers.getInfo.postMessage("");
                }
            }
            //如果useInfo撈取不到資料代表app沒登入
            if ($.isEmpty($.parseJSON(useInfo).account)) {
                $("#real").css("display", "flex");
            }
        }
        return $.parseJSON(useInfo);
    },
    /*app调用函数*/
    getInfoCallback: function (info) {
        if ($.isEmpty(info.account)) {
            $("#real").css("display", "flex");
        } else {
            initCallback = 0;
            $.initList(-1, info);
        }
    },
    /*初始化签到*/
    initSignIn: function () {
        var useInfo;
        //按下了簽到 資料重新取得一次
        if (newCallback == -1) useInfo = $.login();
        else useInfo = use;
        var param = $.extend(useInfo, {"url": mis_url + "/public/ding/today", "actId": actId});
        $.loadingPost(param, function (res) {
            if (res.code == 200) {
                if (res.open >= 1) {
                    $("#goGame").css("display", "flex");
                    $.pop("#goGame", ".m-popCon");
                    $("#gameStart").click(function () {
                        $.initList(0);
                    });
                } else if (res.open == 0) {
                    $("#tip").css("display", "flex");
                    $("#tip .message").empty().text("累计签到天数+1，累计签到天数达标即可参与“消灭病毒”小游戏，赢取随机额度现金红包！！");
                    $.pop("#tip", ".m-popCon");
                    $.initList();
                }
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.code_desc);
                $.pop("#tip", ".m-popCon")
            }
        });
    },
    /*判断是有模拟账户*/
    initAccount: function () {
        var useInfo;
        if (newCallback == -1) useInfo = $.login();
        else useInfo = use;
        var param = $.extend(useInfo, {"url": mis_url + "/public/ding/active"});
        $.loadingPost(param, function (res) {
            if (res.code == 200) {
                if (res.status == 1) gameStart(1);
                else {
                    $("#goGame").hide();
                    $("#activation").css("display", "flex");
                    $.pop("#activation", ".m-popCon")
                }
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.code_desc);
                $.pop("#tip", ".m-popCon")
            }
        })
    },
    /*关闭去游戏弹窗*/
    closeGamePop: function () {
        $("#goGame .masking").click(function () {
            $.initList();
            $('#goGame').hide()
        })
    },
    /*初始化游戏*/
    initGame: function (data) {
        var gameHtml = '', day, startTxt, checked;
        for (var i in data) {
            if (i == 1) day = 1;
            else if (i == 2) day = 3;
            else if (i == 3) day = 7;
            else if (i == 4) day = 12;
            else if (i == 5) day = 15;
            if (data[i].dollar == -1) {
                startTxt = "未解锁";
                checked = ""
            } else if (data[i].dollar == 0) {
                startTxt = "立即游戏";
                checked = " gameOnce"
            } else if (data[i].dollar > 0) {
                startTxt = "已使用";
                checked = " checked"
            }
            gameHtml += '<li>' +
                '           <p>' + day + '天</p>' +
                '           <span>获得1次游戏机会</span>' +
                '           <a class="startGame' + checked + '">' + startTxt + '</a>' +
                '        </li>'
        }
        $("#gameData").empty().append(gameHtml);
        $.startGame(data)
    },
    /*开始游戏*/
    startGame: function (data) {
        $(".startGame").click(function () {
            if (noneHeader == null || $.trim(noneHeader).length <= 0) {
                $("#download").css("display", "flex");
                $.pop("#download", ".m-popCon")
            } else {
                initCallback = -1;
                var indx = $(".startGame").index($(this)) + 1;
                if (data[indx].dollar == 0) {
                    checkRed = indx;
                    $.initAccount()
                }
            }
        })
    },
    /*签到记录与红包详情*/
    initList: function (type, useData) {
        var ding, red, time, start, end, redData = [], html = "", RemovableData = [], useInfo;
         //獲取使用者資料
        //一開始有使用者資料的畫init=0 開始遊戲會變-1 簽到也會變-1 這樣代表沒簽到過是0
        //newCallback是手機登入給  點擊簽到 newCallback才會出現變化 一開始根本沒直
        if (initCallback == 0){
        //狀況-第一次進去app但點簽到 但判斷app端getinfo uiobject是undefined沒反應
            if (newCallback == 0){//手動給app調用函數的資料
                use = useData;
                useInfo = useData;
            //app端getinfo有反應 用這撈取使用者資料
            }else useInfo = $.login();

        //已經簽到過的執行下面這個
        }else {
            if (newCallback == 0) useInfo = use;
            else useInfo = $.login();
        }
        //獲取到的使用者資料加入api送過去 重新撈取資料
        var param = $.extend(useInfo, {"url": mis_url + "/public/ding/list", "actId": actId});
        $.loadingPost(param, function (res) {
            if (res.code == 200) {
                ding = res.ch_msg[0].ding;  //签到时间
                red = res.ch_msg[0].red;  //红包
                time = res.ch_msg[0].time;  //当前时间
                start = res.ch_msg[0].start;  //活动开始时间
                end = res.ch_msg[0].end;  //活动结束时间
                $.dataTime(ding);
                $.initGame(red);
                for (var i in red) {
                    if (red[i].dollar == 0) {
                        redData.push(i);
                    }
                }
                //初始畫簽到initSignIn 開始遊戲 給initList(0)
                if (type == 0) {
                    checkRed = redData[0];
                    $.initAccount()
                //拆開紅包後多少錢的initList(type=1)
                } else if (type == 1) {
                    $("#moneyPop").empty().text(red[checkRed].dollar);
                //跑中獎紀錄的
                } else if (type == 2) {
                    for (var j in red) {
                        if (red[j].dollar > 0) {
                            RemovableData.push({dollar: red[j].dollar, openTime: red[j].openTime})
                        }
                    }
                    if (RemovableData.length <= 0) {
                        $("#winningCon").empty().html("<li><span>暂无奖励！ <br/>请参与游戏赢取随机红包！</span></li>")
                    } else {
                        for (var k in RemovableData) {
                            html += '<li><p>' + $.dateFormatFull(RemovableData[k].openTime) + '</p><p>获得 ' + RemovableData[k].dollar + ' 元红包</p></li>'
                        }
                        $("#winningCon").empty().append(html);
                    }
                }
            //??獲取到使用者資料了 卻說還未登入
            } else if (res.code == 1001) {
                $("#real").css("display", "flex");
                $("#real .message").empty().text(res.code_desc);
                $.pop("#real", ".m-popCon")
            //useInfo不是激活的帳號
            } else if (res.code == 1002) {
                $("#activation").css("display", "flex");
                $("#activation .message").empty().text(res.code_desc);
                $.pop("#activation", ".m-popCon")
            //其他訊息
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.code_desc);
                $.pop("#tip", ".m-popCon")
            }
        })
    },
    /*初始化拆包*/
    //本次你遊戲削麵了 獲得一個防疫紅包 點擊下去拆紅包
    //傳api 把使用者useInfo資料傳過去 然後$.initList(1)
    openRed: function () {
        var useInfo;
        if (newCallback == -1) useInfo = $.login();
        else useInfo = use;
        var param = $.extend(useInfo, {"url": mis_url + "/public/ding/open", "actId": actId, "type": checkRed});
        $.loadingPost(param, function (res) {
            if (res.code == 200) {
                $("#redPop").css("display", "flex");
                $.initList(1);
                $.pop("#redPop", ".m-popCon")
            } else {
                $("#tip").css("display", "flex");
                $("#tip .message").empty().text(res.code_desc);
                $.pop("#tip", ".m-popCon")
            }
        });
    },
    /*点击拆包*/
    clickOpenRed: function () {
        $("#openRed").click(function () {
            $("#epidemicNum").hide();
            $("#redPopNo").css("display", "flex");
            $.pop("#redPopNo", ".m-popCon")
        })
    },
    /*红包拆后*/
    disassembled: function () {
        $(".unopened").click(function () {
            $("#epidemicNum").hide();
            $.openRed();
        })
    },
    /*中间记录*/
    winningRule: function () {
        $(".winningRule").click(function () {
            if (noneHeader == null || $.trim(noneHeader).length <= 0) {
                $("#download").css("display", "flex");
                $.pop("#download", ".m-popCon")
            } else {
                initCallback = -1;
                $("#winningRule").css("display", "flex");
                $.initList(2);
                $.pop("#winningRule", ".m-popCon")
            }
        })
    },
    /*弹窗*/
    pop: function (val, type) {
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var boxHeight = $("" + val + " " + type + "").height();
        $("" + val + " " + type + "").css({"top": (clientHeight - boxHeight) / 2 + "px"})
    }
});
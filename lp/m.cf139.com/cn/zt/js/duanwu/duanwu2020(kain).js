var login = {
    account: "81018191",
    appLogin: false
}
var bRotate = false;
var actId = 98;
const api = {
    initZongzi: pre_op + "/api/activity/luckyDrawReCord/beforeRaffle",
    lotteryZongzi: pre_op + "/api/activity/luckyDrawReCord/startRaffle",
}

$.extend({
    ajaxData: function(options, callbackSuc, callbackErr) {
        options = $.extend(options, { "_r": Math.random() });
        $.ajax({
            type: options.ajaxtype,
            url: options.url,
            async: true,
            data: options,
            dataType: "json", //数据类型为jsonp
            success: function(data) {
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function(data) {
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });
    },
    jsonpAjax: function(options, callbackSuc, callbackErr) {
        $.extend(options, { _r: Math.random() });
        var jsonPUrl = options.url;
        $.ajax({
            type: "GET",
            url: jsonPUrl,
            async: true,
            data: options,
            dataType: "jsonp", // 数据类型为jsonp
            jsonp: 'jsonpCallback',
            success: function(data) {
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function(data) {
                console.log("请求失败，url :" + options.url);
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });
    
    },
    //get提交加载
    loadingGet: function(param, callbackSuc, callbackErr) {
        param = $.extend(param, { "ajaxtype": "GET" });
        $.jsonpAjax(param, callbackSuc, callbackErr);
    },
    //post提交加载
    loadingPost: function(param, callbackSuc, callbackErr) {
        param = $.extend(param, { "ajaxtype": "POST" });
        $.jsonpAjax(param, callbackSuc, callbackErr);
    },
    //post提交加载
    loadingPostNo: function(param, callbackSuc, callbackErr) {
        param = $.extend(param, { "ajaxtype": "POST" });
        $.ajaxData(param, callbackSuc, callbackErr);
    },
    loadingGetNo: function(param, callbackSuc, callbackErr) {
        param = $.extend(param, { "ajaxtype": "GET" });
        $.ajaxData(param, callbackSuc, callbackErr);
    },
    initList: function () {
        var param = $.extend(useInfo, {
            "url": mis_url + api.init,
            "actId": actId
        });
        // var param = $.extend(useInfo, {"url": mis_url + "/public/ding/list", "actId": actId});
        $.loadingPost(param, function (res) {

        })
    },
    pop: function (val, type) {
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var boxHeight = $("" + val + " " + type + "").height();
        $("" + val + " " + type + "").css({
            "top": (clientHeight - boxHeight) / 2 + "px"
        })
    },
    clickZongzi: function (fn) {
        $("#zongzi li").click(function () {
            fn();
        })
    },
    //不是登入app 点级粽子时
    downloadApp: function () {
        $("#download").css("display", "flex");
    },
    //進入app不是登陸真實帳戶執行
    showLogin: function () {
        //註冊帳戶連結
        $("#real").css("display", "flex");
        $("#real .message").empty().text(res.code_desc);
        // $.pop("#real", ".m-popCon")
        // $("goLogin").attr("href","https://admin.cfxdealer.com/")
        $("#goLogin").click(function () {
            window.location.href = "https://admin.cfdealer88.com?intercept_login";
        })
    },
    // =================================================================
    isEmpty: function (str) { //空的为true
        return typeof (str) == "undefined" || str === '' || str == null;
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
        value = "";
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) value = unescape(r[2]);
        return value;
    },
    // =========================================================================
    //检测app自动登陆实现
    initLogined: function () {
        $.loadFromApp();
    },
    isLogin: function (useInfo) {

        // if ($.isEmpty(use.account)) { //如果账户是空的 回传false代表不是登入
        //     // return false;
        //     login.appLogin = false;
        //     // $("#real").css("display", "flex");
        // }
        if ($.isEmpty(useInfo)) {
            login.appLogin = false;
            console.log("app未登入");
            
        }
    },
    loadFromApp: function () {
        // var useInfo="";
        var useInfo;
        var type = $.mechined();
        //如果是安卓手机浏览器且是配置的是APP内应用
        var noneHeader = $.urlParams("noneheader");
        // isLogin=$("#is_login");
        console.log(type,noneHeader);
        console.log($.isEmpty(noneHeader))
        //M站进入
        if($.isEmpty(noneHeader)){
            $.loadFromM()
        }
        //app进入 获取useInfo
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo(); //android终端
            } else if (type == 1) { //ios
                if (typeof (window.getInfo) !== "undefined") {
                    useInfo = window.getInfo();
                } else {
                    window.webkit.messageHandlers.getInfo.postMessage("");
                }
            }
            // $.isLogin($.parseJSON(useInfo))
        }
        // $.isLogin(useInfo)

        // ===模拟
        useInfo = {//这边直接手打的是物件不是json?????
            "account": "81018191",
            "accountType": "1",
            "channel": "umeng",
            "firstLogin": false,
            "hasReal": true,
            "appVerCode": 'm'
        };
        

        //如果从APP获取到的信息不为空，则到后台进行存储
        console.log(typeof(useInfo));
        if (typeof (useInfo) != "undefined") {
            
            console.log("还没parse前的useInfo",typeof(useInfo),useInfo);
            // var user = $.parseJSON(useInfo);
            var user = useInfo;
            console.log("loadFromApp的user",user);
            if (typeof (user.account) != "undefined" && (user.account != null && user.account != "")) {
                login.account = user.account;
                login.appLogin = true;
                console.log("app已登入");
                $.loggedInByAccount(user)
            } else {
                //   "请登入帐户"
                login.appLogin = false;
                $.actZongzi();
            }
        } else {
            login.appLogin = false;
            $.actZongzi()
        }
    },
    //把app的资讯也传去后台
    loggedInByAccount: function (appUserInfo) { //自动登陆
        appUserInfo = $.extend(appUserInfo, {
            "url": mis_url + "/public/lucky/logined/" + actId
        });
        $.jsonpAjax(appUserInfo, function (data) {
            // console.log(data);
            // $.actTurner();
            $.actZongzi();

        }, function (data) {
            // console.log(data);
            $.actZongzi();
        });
    },
    loadFromM:function(){
        $("#zongzi li").click(function(){
            $.downloadApp();
        })

        // $(".rule-button").on("click","a",function(){
        //     let btn = $(this).data('key');      
        //     if(btn=="lottery"){
        //         $("#lottery-box").css("display", "flex")
        //     }else{
        //         $("#award-box").css("display", "flex")
        //     }
        // })
    },
    // ================================================
    // 登入的情况下调用 action 去获取用户的粽子状况 跟给交互行为
    // actZongzi() { //==actTurner
    // https://cors-anywhere.herokuapp.com/
    actZongzi:function() { 
        var param = {
            "url": api.initZongzi,
            "luckyDrawId": actId,
            "account": login.account
        };
		$.loadingPostNo(param, function(data) {
            // console.log("actZongzi,"+ $.parseJSON(data));
            // console.log("actZongzi,"+ data);
            console.log("actZongzi,", data);
		    $.initZongziUser(data);
		}, function(data) {
		    console.info(data);
		});
    },
    //此活动跟此用户的个人粽子 mutation 有可能是空的
    initZongziUser(res) { //==initLuckyUser
        if (res.code == 0) {

            let zongziData = res.data;
            $.showZongziNum(zongziData);
            $.otherPopMsg(zongziData);

            // $("#zongzi li").click(function () {
                if (!login.appLogin || zongziData.customerNo == 0) {
                    // $("#zongzi li").click(function () {
                        $.showLogin;
                    // })
                    return;
                } else {
                    // $("#zongzi li").click(function () {
                        $.checkActivation(zongziData);
                    // })
                    // $.clickZongzi($.checkActivation(zongziData);)//发现有参数没办法包
                }
            // })

        } else {
            console.info(data.ch_msg[0]);
        }
    },
    otherPopMsg: function (zongziData) { //==luckyProp
        if (zongziData.status == 2) {
            $("#zongzi li,#lottery").click(function () {
                $.showTips("活动已停用，如有问题请联系客服。");
            })
        } else if (zongziData.status == 3) {
            $("#zongzi li,#lottery").click(function(){
                $.showTips("活动已结束");
            })
        } else if (zongziData.status == 4) {
            $("#zongzi li,#lottery").click(function(){
                $.showTips("活动尚未开始");
            })
        }
    },
    showZongziNum: function (zongziData) { //進入頁面有登錄真實帳號 顯示粽子數量

        let zongziNum = zongziData.turnTimes;

        if ($.isEmpty(zongziNum)) {
            $("#balance span").empty().text("1颗");
        } else {
            $("#balance span").empty().text(`${zongziNum}颗`);
        }
    },
    // ==========================================================================
    //确定有登入才调用这个方法
    checkActivation: function (zongziData) {
        var options = {
            "url": mis_url + "/public/customer/act/" + zongziData.account
        };
        $.jsonpAjax(options, function (data) {
            if (data.code == 200) {

                data = data.ch_msg;

                if (data.length > 0) {
                    if (typeof (data[0].activetime) == "undefined" || data[0].activetime == "") {
                        $("#zongzi li").click(function () {
                            $.showDeposit();
                        })
                        $("#lottery").click(function () {
                            $.showDeposit();
                        })
                    } else {
                        if (data.prizeId != -2) {
                            if (!bRotate) {
                                bRotate = !bRotate;
                                // $.clickTurn();
                                $.openZongzi();
                            }
                        } else {
                            if (!bRotate) {
                                // $("#zongzi li").click(function () {
                                    $.showLogin();
                                // })
                                // $("#lottery").click(function () {
                                    
                                // })
                            }
                            bRotate = !bRotate;
                        }
                
                    }
                } else {
                    $("#zongzi li").click(function () {
                        $.showDeposit();
                    })
                    $("#lottery").click(function () {
                        $.showDeposit();
                    })
                    
                }
            }
        })

    },
    // ==============================================================================
    openZongzi:function(){ //==clickTurn
        var param = {
            "url":api.lotteryZongzi,
            "luckyDrawId": actId,
            "account": login.account
        }

        // $.loadingPost(param,function(res){
        $.loadingPostNo(param,function(res){

            // console.log("openZongzi,"+res);
            console.log("openZongzi,",res);
            
            $.getLottery(res);
        }),function(data){
            console.error(`clickZongzi_postErr:${res}`);
        }
    },
    //statue
    getLottery: function(data){ //ajaxTurn
        if(!$.isEmpty(data)){
            if (data.code == 0){
                var lotteryResult = data.data.prize;
                $("#zongzi li,#lottery").click(function(){
                    $.showLottery(lotteryResult);//传入中奖金额或于谢谢参与
                    $.actZongzi()//重新改变粽子数量 绑定click反应
                })
                // $("#lottery").click(function () {
                //     $.showDeposit(lotteryResult);
                //     $.actZongzi()//重新改变粽子数量 绑定click反应
                // })
            //后台还没登入
            } else if (data.prizeId == -1){
                $("#zongzi li,#lottery").click(function(){
                    $.showTips("请联系在线客服!","咨询客服",openLive800)
                })
            
            } else if (data.prizeId == -2){
                $("#zongzi li,#lottery").click(function(){
                    $.showLogin()
                })
            //后台没有粽子
            } else if (data.code == 5001){
                // $.showNoZongziNum();
                $("#zongzi li,#lottery").click(function(){
                    $.showTips("您今日的抽奖次数已用完")
                })
            //后台还未达参与资格
            } else if (data.code == 5003 || data.msg == '没有参与资格'){
                $("#zongzi li,#lottery").click(function(){
                    $.showDeposit();
                })
            //后台 活动还未开启
            } else if (data.code == 5004){
                $("#zongzi li,#lottery").click(function(){
                    $.showTips("当前活动未开始!");
                })
            //后台 活动已经关闭
            } else if(data.prizeId == -5){
                $("#zongzi li,#lottery").click(function(){
                    $.showTips("本次活动已结束!");
                })
            } else {
                $("#zongzi li,#lottery").click(function(){
                    $.showTips(data.msg)
                })
            }
        }else{
            console.error(`getLottery_dataErr:${data}`)
        }
    },
    showLottery: function (lotteryResult){
        if(lotteryResult == null){
            $("#pop-lottery .pop-tit>span").empty().text("节日愉快!!");
            $("#pop-lottery .message").empty().text("谢谢参与");
            $("#pop-lottery").show();
        }else{
            $("#pop-lottery .pop-tit>span").empty().text("粽奖了!!");
            $("#pop-lottery .message").empty().html(`恭喜获得<span>${lotteryResult.bonus}</span>美元`);
            $("#pop-lottery").show();
        }
    },
    showDeposit(){//點擊判斷不是激活帳戶執行  //已经有了
        'tc-hide也要开启'
        $("#despite").click(function(){
            window.location.href="https://admin.cfdealer88.com?intercept_deposit";
        })
        $("#activation").css("display", "flex");
    },
    showTips:function(msg,btnMsg,btnFn){
        $("#pop-tip .message").empty().text(msg);
        if(btnMsg){
            $("#pop-tip popItem span").empty().text(btnMsg);
        }
        if(btnFn){
            $("#pop-tip popItem span").click(btnFn)
        }
        $("#pop-tip").show();
    },
})
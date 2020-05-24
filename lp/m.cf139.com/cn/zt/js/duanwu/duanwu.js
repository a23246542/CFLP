let popMsg ={

}
// 關注點分離
//還有規劃api的資料 就知道少了哪些 
// 規劃獲取api存放現在用戶狀態的資料0 -1 2 或是粽子數量
let api = {
    initUser:"https://api.",//loadformApp 样实现自动登入跟拿取使用者资料
    // actId:
    // activation:
    initZongzi:pre_op + "/api/activity/luckyDrawReCord/beforeRaffle",
    lotteryZongzi:pre_op + "/api/activity/luckyDrawReCord/startRaffle",

}

// 0.判断是不是app 
// 1.登入的已经有了 一开始进去出现剩余粽子的api
// 2.点粽子判断用户是不是激活的api
// 3.打开粽子获得美元的api

window.getInfoCallback = function (info) {
    $.getInfoCallback();
}
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
    initList: function(){
        var param = $.extend(useInfo, {"url": mis_url + api.init, "actId": actId});
        // var param = $.extend(useInfo, {"url": mis_url + "/public/ding/list", "actId": actId});
        $.loadingPost(param, function (res) {

        })
    },
    pop: function (val, type) {
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var boxHeight = $("" + val + " " + type + "").height();
        $("" + val + " " + type + "").css({"top": (clientHeight - boxHeight) / 2 + "px"})
    },
    // 不是登入app
    downloadApp: function(){//點擊粽子時
        //判斷是ios還是android
        // $("#download").toggleClass("d-flex");//外面案的masking會吃掉
        // $.pop("#download", ".m-popCon")
        //吃不到
        // if (CheckIsIOS()) {
        //     $("#download .download").attr("href","https://itunes.apple.com/us/app/chuang-fucfd/id1153506842?mt=8");
        // }
        // if (CheckIsAndroid()) {
        //     $(".#download .download").attr("href","https://sc.tfejy.com/source/material/CFD_APP.apk");
        // }
        $("#download").css("display", "flex");
    },
    // ===下面是已登入app===
    //这个事2003抽奖的登录小跳窗
    showLogin: function() {
        // id="loginKuang" 
        // <!--#include file="common-html/campaign-lottery.html"-->
    },
    //跳转到登录页面
    // real:function(){//進入頁面不是登陸真實帳戶執行
    goLogin:function(){//進入頁面不是登陸真實帳戶執行
        //註冊帳戶連結
        $("#real").css("display", "flex");
        $("#real .message").empty().text(res.code_desc);
        // $.pop("#real", ".m-popCon")
        // $("goLogin").attr("href","https://admin.cfxdealer.com/")
        // 用span来实现a的功能
        $("#goLogin").click(function(){
            window.location.href="https://admin.cfdealer88.com?intercept_login";
        })

    },
    // =====================================================================
     // ======================检测app登入资料===============================================
     isEmpty: function (str) {//空的为true
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
    // app有资料就登入进去或传去后台
    // ==================================
    //一开始每次进来要执行的!!!!!
    //检测app自动登陆实现
    initLogined: function() {
        $.loadFromApp();
    },
    login:function(){

        if ($.isEmpty($.parseJSON(useInfo).account)) {
            $("#real").css("display", "flex");
        } else {

        }
    },
    isLogin: function(use){

        if ($.isEmpty(use.account)) {//如果账户是空的 回传false代表不是登入
            return false;
            // $("#real").css("display", "flex");
        }
    },
    //从app捞登入资讯
    loadFromApp: function () {
        var useInfo, type = $.mechined();
        //如果是安卓手机浏览器且是配置的是APP内应用
        var noneHeader = $.urlParams("noneheader");
        // isLogin=$("#is_login");
        if (noneHeader !== null && $.trim(noneHeader).length > 0) {
            if (type == 0 && typeof (uiObject) !== "undefined") {
                useInfo = uiObject.getInfo();//android终端
            } else if (type == 1){ //ios
                if (typeof (window.getInfo) !== "undefined") {
                    useInfo = window.getInfo();
                } else {
                    window.webkit.messageHandlers.getInfo.postMessage("");
                }
            }
        }
        $.isLogin($.parseJSON(useInfo))
        //如果从APP获取到的信息不为空，则到后台进行存储
        if (typeof (useInfo) != "undefined") {
            var user = $.parseJSON(useInfo);
            if (typeof (user.account) != "undefined" && (user.account!=null  && user.account!="")) {
              login.account = user.account;
              $.loggedInByAccount(user)
            } else {
            //   "请登入帐户"
                // $.real();
                $.actZongzi();
            }
        } else {
            $.actZongzi() 
        }
    },
    //把app的资讯也传去后台
    loggedInByAccount: function(appUserInfo) { //自动登陆
        appUserInfo = $.extend(appUserInfo, { "url": mis_url + "/public/lucky/logined/" + actId });
        $.jsonpAjax(appUserInfo, function(data) {
            // console.log(data);
            // $.actTurner();
            $.actZongzi();

        }, function(data) {
            // console.log(data);
            $.actZongzi();
        });
    },
    // ================================================
    // 登入的情况下调用 action 去获取用户的粽子状况 跟给交互行为
    actZongzi(){//==actTurner
        var param = {
            "url": api.initZongzi,
            "luckyDrawId": actId,
            "account": login.account
        };
        $.loadingPost(param,function(res){
            $.initZongziUser(res);
        },function(res){
            console.error(res);
        })
    },
    //此活动跟此用户的个人粽子 mutation
    initZongziUser(res){//==initLuckyUser
        if(res.code == 0){
            let zongziData = res.data;
            $.showZongziNum(zongziData);
            
            "改成before抽粽子前的判断"
            "没app用户讯习依样送过去...但其实没用户不用api判断吧 还是说需要"
            $("#zongzi li").click(function(){
                // if ("自动登入失败 还没登入 抓不到登入资廖~~~~~"){
                //可能此时还没登入
                "不过这样判断偶个问题 如何已经登入了还调用isLogin的结果会是旧的 要确保登入后回到这个页面会执行initLogin更新"
                "或是说传回来的zongziData传回来没有就是没有"
                if (!$.isLogin()){
                    $.goLogin();
                    return;//??有没有加这个的差别

                // } else if ("此用户没激活") {
                //     $.checkActivation()
                //     $.showDeposit()
                // }
                } else {
                    // $.accStatus(data);
                    $.checkActivation(zongziData);
                }
            })

            $.otherPopMsg(res);
        } else {
            console.info(data.ch_msg[0]);
        }
    },
    otherPopMsg: function(){//==luckyProp
        // if (data.status == 2) {
        //     $(".user").html("活动已停用，如有问题请联系客服。");
        // } else if (data.status == 3) {
        //     $(".user").html("活动已结束，下次活动请来早，感谢关注。");
        // } else if (data.status == 4) {
        //     $(".user").html("活动正在赶来的路上，请稍后再尝试。");
        // } else {
        //     if (data.userStatus == 2) {
        //         $(".user").html("当前账号未报名,请先<a href='javascript:void(0)' style='color: #f7ee01;text-decoration: underline;' onclick=\"$.signUp()\">点击报名</a>参与");
        //     } else {
        //         $(".user").html("您今天还可以抽奖 <span>" + data.turnTimes + "</span> 次！");
        //     }
        // }
    },
    showZongziNum:function(zongziData){//進入頁面有登錄真實帳號 顯示粽子數量
                // 原本默認唯一 登入後顯示正確次數
                //綁定事件:點超過次數會說超過 還是說剩下幾顆就顯示幾顆
        "有可能没登入是没资料的给1颗或是不动 有资料再给 Num isEmpty资料存在&&是数字 不然就是1颗"
        let zongziNum = zongziData.turnTimes;
        //如果是数字再秀出来?? 请联系客服
        $("#balance span").text(`${zongziNum}颗`);
    },
    //噢噢 确定有登入才调用这个方法
    checkActivation:function(zongziData){
        "话说要不要再点极之前就跑这个api先确认加快速度"
        //需要跑出激活帳戶連結
        // var options = { "url": mis_url + "/public/customer/act/" + data.account };
        var options = { "url": mis_url + "/public/customer/act/" + zongziData.account };
        $.jsonpAjax(options, function(data) {
            if (data.code == 200) {
                data = data.ch_msg;
                if (data.length > 0) {
                    if (typeof(data[0].activetime) == "undefined" || data[0].activetime == "") {
                        $.showDeposit();
                        // $("#deposit").show();
                        // if (window.screen.width <= 750) {
                        //     var hg = $("#main").height();
                        //     var hg1_c = $("#deposit .m-tcCon").height(),
                        //         result1 = (hg - hg1_c) / 2;
                        //     $("#deposit .m-tcCon").css("top", result1);
                        // }
                    } else {
                        // $.rotateFn(data);
                        // rotateFn: function(data) {
                            //再确认一次后台已经登陆了
                            if (data.prizeId != -2) {
                                if (!bRotate) {
                                    bRotate = !bRotate;
                                    // $.clickTurn();
                                    $.clickZongzi();
                                }
                            } else {
                                if (!bRotate) {
                                    $.showlogin();//但我這邊應該是goLogin
                                }
                                bRotate = !bRotate;
                            }
                        // },
                    }
                } else {
                "可是如果是没登入的回传的资料 也是入金激活帐户??"
                "??!!虽然网址导像一漾 可是没办法判断给说是请激活还是请登入啊?"
                    $.showDeposit();
                    // $("#deposit").show();
                    // if (window.screen.width <= 750) {
                    //     var hg = $("#main").height();
                    //     var hg1_c = $("#deposit .m-tcCon").height(),
                    //         result1 = (hg - hg1_c) / 2;
                    //     $("#deposit .m-tcCon").css("top", result1);
                    // }
                }
            }
        })
        
    },
    showDeposit: function(){


    },
// ========================================================================
    //登入且激活的状况下click调用 action
    // clickZongzi:function(){
    openZongzi:function(){ //==clickTurn
        var param = {
            "url":api.lotteryZongzi,
            "luckyDrawId": actId,
            "account": login.account
        }
        // if(zongziNum>0){
            // var param = {
            //     url:api.lotteryZongzi,
            //     "luckyDrawId": actId,
            //     "account": login.account
            // }
            $.loadingPost(param,function(res){
                $.getLottery(res);
            }),function(data){
                console.error(`clickZongzi_postErr:${res}`);
            }
            // $.actZongzi()//重新改变粽子数量 绑定click反应
        // }else{//前台没粽子
        //     "function tip说已经没粽子"
        // }
        //如果为0颗就说已经没粽子了
        //典籍粽子抽奖后 要重新取得粽子actZongzi
    },
    //statue
    getLottery: function(data){ //ajaxTurn
        // 还可以抽奖 要麻获奖要吗谢谢参与
        //登入才掉用 提使没登入
        //虽然是入金才调用 可是这边再确认一次
        //粽子已经用完了tipOrderNo
        //活动还没开始
        //活动已经结束
        //其他状况请联系在线客服
        if(!$.isEmpty(data)){
            if (data.code == 0){
                var lotteryResult = data.data.prize;
                $.showLottery(lotteryResult);//传入中奖金额或于谢谢参与
                $.actZongzi()//重新改变粽子数量 绑定click反应
            //后台还没登入
            } else if (data.prizeId == -1){
                $.showTips("请联系在线客服!","线上咨询",openLive800)
                "是否要出现liveopen800"
            } else if (data.prizeId == -2){
                $.real()
                "改成showLogin"
            //后台没有粽子
            } else if (data.code == 5001){
                // $.showNoZongziNum();
                $.showTips("您今日的抽奖次数已用完")
            //后台还未达参与资格
            } else if (data.code == 5003 || data.msg == '没有参与资格'){
                $.showDeposit();
            //后台 活动还未开启
            } else if (data.code == 5004){
                $.showTips("当前活动未开始!");
                // if (window.screen.width <= 750) {
                //     var hg = $("#main").height();
                //     var hg1_c = $("#deposit .m-tcCon").height(),
                //         result1 = (hg - hg1_c - 100) / 2;
                //     $("#deposit .m-tcCon").css("top", result1);
                // }
            //后台 活动已经关闭
            } else if(data.prizeId == -5){
                $.showTips("本次活动已结束!");
            } else {
                $.showTips(data.msg)
            }
        }else{
            console.error(`getLottery_dataErr:${data}`)
        }
    },
    showTips:function(msg,btnMsg,btnfn){
        // $("#pop-tip .pop-tit").empty().text("温馨提示");
        $("#pop-tip .message").empty().text(msg);
        if(btnMsg){
            $("#pop-tip popItem span").empty().text(btnMsg);
        }
        if(btnFn){
            $("#pop-tip popItem span").click(btnFn)
        }
        $("#pop-tip").show();
    },
    // showNoZongziNum: function(){
    //     $("#pop-tip .pop-tit").empty().text("温馨提示");
    //     $("#pop-tip .message").empty().text("您今日的抽奖次数已用完");
    //     $("#pop-tip").show();
    // },
    showLottery: function (lotteryResult){
        if(lotteryResult == null){
            $("#pop-lottery .pop-tit>span").empty().text("节日愉快!!");
            $("#pop-lottery .message").empty().text("谢谢参与");
            $("pop-lottery").show();
        }else{
            $("#pop-lottery .pop-tit>span").empty().text("粽奖了!!");
            $("#pop-lottery .message").empty().html(`恭喜获得<span>${lotteryResult.bonus}</span>美元`);
            $("pop-lottery").show();
        }
    },
    showDeposit(){//點擊判斷不是激活帳戶執行  //已经有了
        'tc-hide也要开启'
        $("#despite").click(function(){
            window.location.href="https://admin.cfdealer88.com?intercept_deposit";
        })
        // $("#activation .message").empty().text(res.code_desc);//打卡api才有code_desc
        
        // $.pop("#activation", ".m-popCon")
        // $("#despite").attr("href","https://admin.cfxdealer.com/fundDepositOnline.do?intercept_deposit")
        $("#activation").css("display", "flex");
    },
    showTips: function(){

    },

// ================================================================
    
   
})

// =======暫時不需要==================
// var getCookie = function (name) {
    //     var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    //     if(arr=document.cookie.match(reg))
    //         return unescape(arr[2]);
    //     else
    //         return null;
    // }

    // var isLogin = function(){
    //     var cookie = getCookie('duanwu');
    //     if(cookie == null || cookie == ""){
    //         //弹出登录框
    //         return false;
    //     }
    //     return true;
    // }
    // console.log(isLogin());



// $(function(){
//     if (noneheader !== null && $.trim(noneheader).length > 0) {

           
//         if (typeof (useInfo) != "undefined") {

//             var user = $.parseJSON(useInfo);
//             console.log(user.account);
        
//             if (typeof (user.account) != "undefined" && (user.account!=null  && user.account!="")) {
//                 console.log("已登入显示剩余的粽子数");
                
//                 // 判断有没有激活 沒機活談窗去雞活
//                 // https://admin.cfxdealer.com/fundDepositOnline.do?intercept_deposit

//             } else {
//                 console.log("未登入 弹窗显示请登入真实账号 但不知道登入去哪 看病毒");
//             }
//         } else {
//             console.log("表示还没登入或注册");
//             //舌么kian的messagehandle
//             // window.webkit.messageHandlers.getInfo.postMessage("");
//             // if ($.isEmpty($.parseJSON(useInfo).account)) {
//             if ($.isEmpty(user.account)) {
//                 $("#real").css("display", "flex");
//             }
//         }
//         // if (type != -1){//-1 可能是内迁浏览器开启的 连结开启app 可是要连去哪
//         //     //请下载app登入
//         //     // alert("请下载app-type")
//         // }else{
//         //     console.log("判断登入");
            
//         //     //判断是否登入     
//         //     if(!isLogin()){
//         //         console.log("未登入");
                
//         //     // $("#loginKuang").show();
//         //     }else {
//         //     // $.goPrize();
//         //         console.log("已登入");
                
//         //     }
//         // }
        
//     }else{//非真正的app登入 M站网页登入
//         //弹窗请下载app登入 连结判断手机如下
//         console.log("hello");
        
//         // alert("请下载app-noneheader")
        
//     }
// }) 

 // 要抽奖 如果是m站就跑登入app 如果是app旧跑出登录视窗

   
    // $.extend({
    //     //要抽奖 确定是app进去
    //     appLogin:function(){
    //         let noneHeader = $.urlParams("noneheader"), type = $.mechined();
    //         if (noneHeader !== null && $.trim(noneHeader).length > 0) {
    //             if (type != -1){
    //                 //确定是手机app 检查是否登入
    //             }else{
    //                 //弹掉
    //             }
    //             // 弹掉趣登入
    //         }
    //     }
    // })
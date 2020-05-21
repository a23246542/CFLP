let popMsg ={

}
// 關注點分離
//還有規劃api的資料 就知道少了哪些 
// 規劃獲取api存放現在用戶狀態的資料0 -1 2 或是粽子數量

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
        var param = $.extend(useInfo, {"url": mis_url + "/public/ding/list", "actId": actId});
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
    real:function(){//進入頁面不是登陸真實帳戶執行
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
    zongziNum:function(){//進入頁面有登錄真實帳號 顯示粽子數量
                // 原本默認唯一 登入後顯示正確次數
                //綁定事件:點超過次數會說超過 還是說剩下幾顆就顯示幾顆

                // var param = {
                //     "url": pre_op + "/api/activity/luckyDrawReCord/beforeRaffle",
                //     "luckyDrawId": actId,
                //     "account": longin.account
                // };
                // 这个接口是获取抽奖次数的接口
                // data.turnTimes  这个是接口返回的抽奖次数
    },
    activation:function(){//點擊判斷不是激活帳戶執行
        //需要跑出激活帳戶連結
        $("#activation").css("display", "flex");
        $("#activation .message").empty().text(res.code_desc);
        // $.pop("#activation", ".m-popCon")
        // $("#despite").attr("href","https://admin.cfxdealer.com/fundDepositOnline.do?intercept_deposit")
        $("#despite").click(function(){
            window.location.href="https://admin.cfdealer88.com?intercept_deposit";
        })
    },
    lottery: function(){//點擊判斷是激活帳戶執行
        //恭喜獲得or謝謝參與的跳窗
    },
    isEmpty: function (str) {
        return typeof (str) == "undefined" || str === '' || str == null;
    },
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
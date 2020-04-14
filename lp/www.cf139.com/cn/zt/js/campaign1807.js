$('.submit').click(function(){
    //未登录
    var len=$('.check').children("a").length;
    if (len>0) {
        $(".hide-infor").show();
        setTimeout(function () {
            $(".hide-infor").hide();
        },3000)
    }else if (!$.isLogin()) {
        $(".hide-infor").hide();
        $("#loginKuang").show();
    }else{
        $.getHistroy();
    }
});
$.extend({
    JsonAjax:function(url,options, callbackSuc, callbackErr){
        $.extend(options,{_r:Math.random()});
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            data: options,
            dataType: "jsonp",// 数据类型为jsonp
            jsonp:'jsonpCallback',
            success: function (data) {
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
    postAjax:function(url,options, callbackSuc, callbackErr){
        $.extend(options,{url:Math.random()});
        $.ajaxk("POST",url,options, callbackSuc, callbackErr);
    },
    getAjax:function(url,callbackSuc, callbackErr){
        $.extend(options,{url:Math.random()});
        $.ajaxk("GET",url,"", callbackSuc, callbackErr);
    },
    //获取cookie
    cookie:function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    //登录
    login:function(){
        $("#loading").show();
        var url = mis_url+"/cfd/fxlogin";
        var options = {
            /*customerNumber:"81015540",
            password:"ct170424",*/
            customerNumber:$("#phone").val(),
            password:$("#upwd").val(),
            platform:"GTS2",
            actId:"1"
        };
        $.JsonAjax(url,options,function(data){
            if(data.code == 200){
                $("#loginKuang").hide();
                $(".bet-tc01 span").text("提交竞猜答案");
                $(".re-n").hide();
                $(".bet-tc01 .item02").hide();
                $(".bet-tc01").show();
                $.getHistroy();
            }else{
                $(".error-info").show().html(data.ch_msg);
            }
        });
    },
    //初始化
    init:function () {
        var cookie = $.cookie('actlucky');
        if(cookie != null || cookie != "") {
            $.getHistroy(true);
        }
    },
    //是否竞猜
    isLogin:function(){
        var cookie = $.cookie('actlucky');
        if(cookie == null || cookie == ""){
            //弹出登录框
            return false;
        }
        return true;
    },
    //竞猜次数
    /*lotteryNum:function(){
        var url = mis_url+"/worldCup/getAvailableTimes";
        $.JsonAjax(url,null,function(data){
            if(data.code == 200){
                console.log(data.ch_msg.times)
                if(data.ch_msg.times==0){
                    alert("次数用完");
                }else if(data.ch_msg.times>0&&data.ch_msg.times<3){
                    //确认修改吗
                }
                /!*if(data.ch_msg.times==0){
                    $(".bet-tc01").hide();
                    $(".tc-suc").attr("src","//img.getfc.com.cn/source/www/zt/campaign1807/icon-err.png")
                    $(".bet-tc .span-show").show().text("很抱歉，您的竞猜修改机会已用完！");
                    $(".bet-tc p").text("（ 竞猜仅有 3 次机会 ）");
                    $(".bet-tc").show();
                }*!/
            }
        });
    },*/
    //保存内容
    saveContent:function(){
        var url = mis_url+"/worldCup/start";
        var option = {};
        $(".check").each(function(){
           option[$(".check").index(this)+1] = $(this).text().replace("我要竞猜","");
        });
        $.JsonAjax(url,{questionInfo:JSON.stringify(option)},function(data){
            if (data.code == 200) {
                $(".bet-tc").show();
            }else if(data.code == 501) {
                $(".tc-suc").attr("src","//img.getfc.com.cn/source/www/zt/campaign1807/icon-err.png")
                $(".bet-tc .span-show").show().text("很抱歉，您的竞猜修改机会已用完！");
                $(".bet-tc p").text("（ 竞猜仅有 3 次机会 ）");
                $(".bet-tc").show();
                $(".bet-tc01").hide();
            }
        });
    },
    //获取历史记录
    getHistroy:function (isInit) {
        var url = mis_url+"/worldCup/queryHistroy";
        $.JsonAjax(url,null,function(data){
            if (data.code == 200){
                var hist =JSON.parse(data.ch_msg[0].questionInfo);
                for(var i=3;i>0;i--){
                    var city = hist[i];
                    if (city ==""){
                        $(".bet-con .list .item01 span").eq(i-1).text("--");
                        $(".bet-tc01 .item02 span").eq(i-1).text("--");
                    }else {
                        $(".bet-con .list .item01 span").eq(i-1).text(city);
                        $(".bet-tc01 .item02 span").eq(i-1).text(city);
                    }
                }
                if(!isInit){
                    if (data.ch_msg.length>=3){
                        $(".bet-tc01").hide();
                        $(".tc-suc").attr("src","//img.getfc.com.cn/source/www/zt/campaign1807/icon-err.png")
                        $(".bet-tc .span-show").show().text("很抱歉，您的竞猜修改机会已用完！");
                        $(".bet-tc p").text("（竞猜仅有 3 次机会）");
                        $(".bet-tc").show();
                    }else if(data.ch_msg.length>0){
                        $(".re-n").show();
                        $(".bet-tc01 .item span").text("您确认修改为此次的竞猜答案吗？");
                        $(".bet-tc01 .item02").show();
                        $(".bet-tc01").show();
                    }
                }

            }

        });
    }
});
$(".re-y").click(function () {
    $.saveContent();
});
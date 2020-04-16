var m_url = "<!--#echo var='M_URL' default=''-->";
$('.click-lottery').click(function(){
    //未登录
    if(!$.isLogin()){
        $("#loginKuang").show();
    }else {
        $.goPrize();
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
            /* xhrFields: {
                 withCredentials: true
             },
             crossDomain:true,*/
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
    //初始化
    init:function(){
        var cookie = $.cookie("JSESSIONID");
        if (cookie != null || cookie != ""){
            //登录
            $.lotteryNum(true);
        }
    },
    //登录
    login:function(){
        $("#loading").show();
        var url = m_url +"/news/login";
        var options = {
            phone: $("#phone").val(),
        };
        $.JsonAjax(url,options,function(data){
            console.log(data);
            if(data.code == 0){
                $.cookie('JSESSIONID');
                $("#loginKuang").hide();
                $.lotteryNum(false);
            }else{
                $(".phonee-tip").text("请输入正确的相关信息");
            }
        });
    },
    //抽奖
    isLogin:function(){
        var cookie = $.cookie('JSESSIONID');
        if(cookie == null || cookie == ""){
            //弹出登录框
            return false;
        }
        return true;
    },
    //抽奖次数
    lotteryNum:function (isInit) {
        var url = m_url +"/news/getTime";
        $.JsonAjax(url,null,function(data){
            if(data.code == 0){
                $("#loginKuang").hide();
                $(".no-login").hide();
                $(".y-login").css("display","block").children(".num").html(data.data);
            }else if(data.code == 20038){//未登录
                if(isInit) return;
                $.cookie('JSESSIONID');
                $("#loginKuang").show();
            }else{
                $(".currency-tc").show();
            }
        });
    },
    //抽奖
    goPrize:function(){
        var url = m_url +"/news/done";
        $.JsonAjax(url,null,function(data){
            if (data.code == 0) {
                $.lotteryNum(false);
                $(".no-login").hide();
                $(".currency").addClass("rotating");
                setTimeout(function(){
                    $(".gift").html(data.data.giftName);
                    $(".tc").show();
                    $(".currency").removeClass("rotating");
                    $("#main").addClass("height");
                    $(".web-banner").hide();
                    $(".lottery-title").hide();
                    $(".m-header").hide();
                }, 3000);
            }else if(data.code == 40014) {
                $(".currency-tc").show();
                $(".no-login").hide();
                $(".y-login").css("display","block").text("您暂无抽奖机会，快去交易再来抽现金吧");
            }else if(data.code == 20007){
                $(".currency-tc").show();
            }else if(data.code == 20038) {
                $("#loginKuang").show();
            }
        });
    }

});
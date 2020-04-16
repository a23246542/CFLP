$(".match").click(function(){

    if(!$.isLogin()){
        $("#loginKuang").show();
    }else {
        $.goPrize();
        $(this).removeClass('to_down').addClass("to_bottom");
        setTimeout(function(){
            $(".match").css("opacity","0");
            $(".core-tuan").show();
        },400);

        setTimeout("$(\".fire-core\").addClass('to_bottom1')",600);
        setTimeout(function(){
            $(".main").addClass("height");
            $(".fire-pic").show().addClass("to_big");

        },1200);
    }


});
$(".close").click(function(){
    $(".match").css("opacity","1").addClass('to_down').removeClass("to_bottom");
    $(".core-tuan").hide();
    $('.fire-pic').hide();
    $(".main").removeClass("height");
    $(".fire-core").removeClass("to_bottom1");
});
$.extend({
    JsonpAjax:function(url,options, callbackSuc, callbackErr){
        $.extend(options,{_r:Math.random()});
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            data: options,
            dataType: "jsonp",// 数据类型为jsonp
            jsonp:'jsonpCallback',
            beforeSend:function(){
                $("#loading").html("<img src='//img.getfc.com.cn/source/www/zt/newyear-lottery/jiazai.gif' />"); //在后台返回success之前显示loading图标
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
    ajaxk:function (type,url,options, callbackSuc, callbackErr) {
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
    postAjax:function(url,options, callbackSuc, callbackErr){
        $.extend(options,{url:Math.random()});
        $.ajaxk("POST",url,options, callbackSuc, callbackErr);
    },
    getAjax:function(url,callbackSuc, callbackErr){
        $.extend(options,{url:Math.random()});
        $.ajaxk("GET",url,"", callbackSuc, callbackErr);
    },
    //获取cookie
    cookie:function(name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    //登录
    login:function(){
        $("#loading").show();
        var url = mis_url + "/cfd/fxlogin";
        var options = {
            /* customerNumber:"81015540",
             password:"ct170424",*/
            customerNumber:$("#phone").val(),
            password:$("#upwd").val(),
            platform:"GTS2",
            actId:"1"
        }
        $.JsonpAjax(url,options,function(data){
            // console.log(data);
            if(data.code == 200){
                console.log("登录成功");
                $("#loginKuang").hide();
                $(".m-login").html("点击火柴抽奖")
                //
            }else{
                //console.log(data.ch_msg);
                $(".error-info").show().html(data.ch_msg);
            }
        });
    },
    //抽奖
    isLogin:function(){
        var cookie = $.cookie("actlucky");
        //console.log(cookie);
        if(cookie == null || cookie == ""){
            //弹出登录框
            return false;
        }


        return true;
        //抽奖
        /*var url = mis_url + "/lucky/start";
        $.JsonpAjax(url,null,function(data){
            console.log(data);
            if(data.ch_msg == "OK"){
                console.log("抽奖成功");
            }else{
                console.log(data.error.message);
            }
        });*/
    },
    //抽奖
    goPrize:function(){
        var url = mis_url + "/lucky/start";
        $.JsonpAjax(url,null,function(data){
            //console.log(data);
            if(data.code == 500){
                $(".nowinning").show();
                $(".prizewinning").hide();
                $(".layout-m").show();
                $("#noPriceContent").empty().html(data.ch_msg);
            }else if(data.code == 200){
                $(".layout-m").hide();
                $(".prizewinning").show();
                $(".nowinning").hide();
                $("#priceContent").empty().html(data.ch_msg);
            }
        });
    },

});
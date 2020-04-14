$('.huocai').click(function(){
//        未登录
    if(!$.isLogin()){
        $("#loginKuang").show();
    }else {
        $.goPrize();
        $(".nologin-info").hide();
        $(this).children("img").removeClass("to_arrow");
        $(this).children("img").addClass("to_left");

        setTimeout("$('.huo').hide()",200);
        setTimeout("$('.xin').addClass('to_bottom')",200);
        setTimeout("$('.xin-huo').show()",200);
        setTimeout("$('.xin-huo').addClass('to_bottom1')",200);
        setTimeout("$('.xin-huo').hide()",700);
        setTimeout("$('.xin').hide()",700);
        setTimeout("$('.tc-con').show()",700);
        setTimeout("$('.tc').hide()",700);
        setTimeout("$('.tc').show()",1000);
        setTimeout("$('#main').addClass('height')",700);

    }
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
            /*customerNumber:"81015540",
            password:"ct170424",*/
            customerNumber:$("#phone").val(),
            password:$("#upwd").val(),
            platform:"GTS2",
            actId:"1"
        }
        $.JsonpAjax(url,options,function(data){
            //console.log(data);
            if(data.code == 200){
                console.log("登录成功");
                $("#loginKuang").hide();
                $(".pc-login").html("点击火柴抽奖")
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
                $(".tc span").css("padding-top","28px");
                $("#noPriceContent").html();
                $("#noPriceContent").empty().html(data.ch_msg);
                $(".tc").addClass("changeColor");
            }else if(data.code == 200){
                $(".prizewinning").show();
                $(".nowinning").hide();
                $(".tc span").css("padding-top","0");
                $("#priceContent").empty().html(data.ch_msg);
                $(".tc").removeClass("changeColor");
            }
        });
    },

});
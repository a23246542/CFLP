var bRotate = false;
var actId = 2;
var imgSrc = ["500", "200", "100", "50", "10"];
var winId;
//var mis_url = "http://mis.cf860.com";
$.extend({
    ajaxData: function (options, callbackSuc, callbackErr) {
        options = $.extend(options, {"_r": Math.random()});
        $.ajax({
            type: options.ajaxtype,
            url: options.url,
            async: true,
            data: options,
            dataType: "json",//数据类型为jsonp
            success: function (data) {
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });
    },
    jsonpAjax: function (options, callbackSuc, callbackErr) {
        $.extend(options, {_r: Math.random()});
        var jsonPUrl=options.url;
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
    initLuckyLottery: function () {
        //初始用户是否登陆,主要是针对app，保证app登陆了，h5就不用登陆
        $.initLogined();
        //登陆操作
        $(".clickLogin").click(function () {
            $.loginTurn();
        });
        //中奖记录
        [$(".sucRule"), $(".con .item-3")].forEach(function (item) {
            item.click(function () {
                $("body").css("overflow", "hidden");
                $.record();
                $("#suc").hide();
                $("#failure").hide();
                $("#noNum").hide();
            });
        });

        //跑马灯
        $.paoma();

    }, setCookie: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },delCookie:function(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=$.getCookie(name);
        var domain=mis_url.replace(/(http|https):\/\/mis./,"");
        alert(cval);
        if(cval!=null)
            document.cookie= name + "="+cval+";domain="+domain+";path=/;expires="+exp.toGMTString();
        alert($.getCookie(name));
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }, initLuckyUser: function (data) {
        if (data.code == 200) {
            data = data.ch_msg[0];
            $.luckyProp(data);
            $(".lotteryStart").click(function () {
                $("body").css("overflow", "hidden");
                if ($.getCookie("actlucky") == null) {
                    $.showlogin();
                    return;
                }
                $.rotateFn(data);
            });
        } else {
            alert(data.ch_msg[0]);
        }
    }, luckyProp: function (data) {
        if(data.customerNo==0)
        {
            $(".user").html("请先<a href='javascript:void(0)' style='color: #ffd9b7;text-decoration: underline;' onclick=\"$.showlogin()\">登陆账号</a>,再参与活动（限已激活用户）");
        }
        else {
            if(data.leftTime>0)
            {
                $(".user").html("亲爱的<p class='account'>"+data.customerNo+"</p> 客户，活动暂未开始！");
            }
            else
            {
                $(".user").html("亲爱的<p class='account'>"+data.customerNo+"</p> 客户，今天剩余次数：<p>"+data.turnTimes +"次</p>");
            }

        }
        var time = data.leftTime;
        var result=data.prizeId;
        $.timeElapse(time,result);
       winId= setInterval(function () {
            time -= 1000;
            $.timeElapse(time,result);
        }, 1000);
    }, rotateFn: function (data) {
        console.info(data);
        //如果已经登陆了
        if (data.prizeId != -2) {
            if (!bRotate) {
                bRotate = !bRotate;
                $.clickTurn();
            }
        } else {
            if (!bRotate) {
                $.showlogin();
            }
            bRotate = !bRotate;
        }
    }, clickTurn: function () {
        var param = {"url": mis_url + "/public/lucky/turn/" + actId};
        $.loadingPost(param, function (data) {
            $.ajaxTurn(data)
        }, function (data) {
            console.info(data);
        });
    }, ajaxTurn: function (data) {
        if (data.code == 200) {
            data = data.ch_msg[0];
            //如果有中奖，则根据返回的角度进行转动
            if (data.prizeId >= 0) {
                $(".lotteryCon").removeClass("rotate")
                $('.lotteryCon').stopRotate();
                console.info(data);
                $('.lotteryCon').rotate({
                    angle: 0,
                    animateTo: data.angle + 1040,
                    duration: 3000,
                    callback: function () {
                        bRotate = !bRotate;
                        var turnTimes = data.turnTimes;
                        turnTimes = turnTimes > 0 ? turnTimes - 1 : 0;
                        $("p.account").siblings("p").html(turnTimes + "次");
                        if (data.prizeId > 0) {
                            $.showSucImg(data.prizeId);
                            $("#suc").show();
                        } else if (data.prizeId == 0) {
                            $("#failure").show();
                        }

                    }
                });
                return;
            }
            //如果后台返回的提示中没有登陆
            else if (data.prizeId == -2)
                $.showlogin();
            else if (data.prizeId == -3)
                $("#noNum").show();
            else if (data.prizeId == -4)
                $("#notStart").show();
            else if (data.prizeId == -5)
            {
                $("#end").show();
                $("#elapseClock").html("本期已结束，发放奖励中");
            }
            else alert(data.prizeName);
        } else {
            alert(data.code_desc);
        }
        bRotate = !bRotate;
    }, loginTurn: function () {
        if (!$.checkInput()) return;
        var options = {
            /* customerNumber:"81015540",
             password:"ct170424",*/
            customerNumber: $.trim($("#phone").val()),
            password: $.trim($("#upwd").val()),
            platform: "GTS2",
            actId: actId,
            url: mis_url + "/cfd/fxlogin"
        }
        $.jsonpAjax(options, function (data) {
            console.log(data);
            if (data.code == 200) {
                window.location.reload(true);
            } else {
                $(".sub_error .error-info").show();
            }
        }, function () {

        });
    }, checkInput: function () {
        var phone = $.trim($("#phone").val());
        if (phone.length <= 0) {
            $(".phone-tip").html("账户或手机号不能为空");
            return false;
        } else $(".phone-tip").empty();
        var upwd = $.trim($("#upwd").val());
        if (upwd.length <= 0) {
            $(".upwd-tip").html("密码不能为空");
            return false;
        } else $(".upwd-tip").empty();
        return true;
    }, record: function () {
        var param = {"url": mis_url + "/public/lucky/record/" + actId};
        $.loadingPost(param, function (data) {
            console.info(data);
            if (data.code == 200) {
                data = data.ch_msg;
                var html = "";
                if (data.length <= 0) {
                    html += " <li>无记录</li>";
                } else
                    data.forEach(function (item) {
                        html += " <li><span>" + item.time + "</span><span>" + item.prizeName + "</span></li>";
                    });
                $("#record").show();
                $(".recordCon ul").empty().append(html);

            } else if (data.code == 500) {
                $.showlogin();
            }
        }, function (data) {
            console.info(data);
        });
    }, paoma: function () {
        var param = {"url": mis_url + "/public/lucky/users/" + actId};
        $.loadingPost(param, function (data) {
            if (data.code == 200) {
                data = data.ch_msg;
                var html = "";
                if (data.length <= 0) {
                    html += " <li><div class=\"item\">无记录</div></li>";
                } else
                    data.forEach(function (item) {
                        html += "  <li><div class=\"item\">恭喜 " + item.customerNo + " 客户转出了 " + item.prizeName + " 大奖</div></li>";
                    })
                $(".marquee ul").empty().append(html);
                $(".marquee").slide({
                    mainCell: ".layout ul",
                    autoPlay: true,
                    effect: "leftMarquee",
                    interTime: 50,
                    trigger: "click",
                    vis:2
                });
            }
        }, function (data) {
            console.info(data);
        });
    }, showSucImg: function (prizeId) {
        var index = parseInt(prizeId) - 1;
        $("#suc .item-2 img").attr("src", "//img.getfc.com.cn/source/www/zt/mobile/newyear19/" + imgSrc[index] + "-tc.png");
    },timeElapse:function(second, prizeId) {
    second = second/ 1000;
    if (second<=0){
        var day='00';
        var hour='00';
        var minute='00';
        var second='00';
    }else {
        var day = Math.floor(second / (3600 * 24));
        second = second % (3600 * 24);
        var hour = Math.floor(second / 3600);
        if (hour < 10) {hour = "0" + hour}
        second = second % 3600;
        var minute = Math.floor(second / 60);
        if (minute < 10) {minute = "0" + minute}
        second =  Math.floor(second % 60);
        if (second < 10) {second = "0" + second}
    }

    if(day+hour+minute+second=="00000000")
    {
        if(prizeId==-5)
            $("#elapseClock").html("本期已结束，发放奖励中");
       else  $("#elapseClock").html("火爆进行中");
        clearInterval(winId);

    }
    else
    {
        $("#elapseClock").html('<span>'+ day + '</span>' +
            '<p>天</p>' +
            '<span>'+ hour + '</span>' +
            '<p>时</p>' +
            '<span>' + minute + '</span>' +
            '<p>分</p>' +
            '<span>' + second + "</span>" +
            "<p>秒后开始</p>")
    }
},mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },showlogin:function () {
        var noneHeader =$.urlParams("noneheader"), type=$.mechined();
        if(noneHeader!==null  && $.trim(noneHeader).length>0)
        {
            if(type!=-1 )
                window.location.href="intercept_login";
            else $("#login").show();
        }
        else $("#login").show();
    },initLogined:function(){//检测app自动登陆实现
        //"actlucky:"+$.getCookie("actlucky"));
        $.loadFromApp();
    },loadFromApp:function () {
       var  useInfo,  type=$.mechined();
       //如果是安卓手机浏览器且是配置的是APP内应用
        var noneHeader =$.urlParams("noneheader");
        if(noneHeader!==null  && $.trim(noneHeader).length>0)
        {
            if(type==0 && typeof (uiObject) !== "undefined"){
                useInfo= uiObject.getInfo();//android终端
            }
            else  if(type==1)  useInfo=getInfo();//ios
        }
        if(typeof(useInfo) !== "undefined")//如果从APP获取到的信息不为空，则到后台进行存储
        {
            var user=  $.parseJSON(useInfo);
            if(typeof(user.account) !="undefined")
            {
                $.loginedByAccout(user);
            }
            else
            {
                $.actTurner();
            }
        }
        else $.actTurner();
    },actTurner:function () {
        //转到转盘操作
        var param = {"url": mis_url + "/public/lucky/times/" + actId};
        $.loadingPost(param, function (data) {
            $.initLuckyUser(data)
        }, function (data) {
            console.info(data);
        });
    },loginedByAccout:function(appUserInfo)//自动登陆
    {
        appUserInfo= $.extend(appUserInfo,{"url":mis_url+"/public/lucky/logined/"+actId});
        $.jsonpAjax(appUserInfo, function (data) {
            console.log(data);
            $.actTurner();
        }, function (data) {
            console.log(data);
            $.actTurner();
        });
    }, urlParams: function (key) {
        value = "";
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) value = unescape(r[2]);
        return value;
    }
});
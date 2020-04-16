
function initTracker() {
    var result;
    ga(function(tracker) {
        var clientId = tracker.get('clientId');
        if (typeof clientId==='undefined' || clientId===null){
            clientId = "";
        }
        result = {
            unique : tracker.get('clientId'),
            hostname : window.location.hostname,
            referrer : window.location.href,
            href : window.location.href
        }
    });
    return result;
}

function setToHiddenFields(tracker) {
    $('#unique').val(tracker.unique);
    $('#hostname').val(tracker.hostname);
    $('#referrer').val(tracker.referrer);
    $('#href').val(tracker.href);
}
var messageInfo ={
    info:function (id1,msg) {
        $('.'+id1+'-tip').html(' <span><em></em>'+msg+'</span>');
        $('.'+id1+'-f1').addClass("error").removeClass("yellow");


    },
    success:function (id1) {
        $('.'+id1+'-tip span').hide();
        $('.'+id1+'-f1').removeClass("yellow").addClass("success");
    },
    alert:function (id1,msg) {
        $('.'+id1+'-tip').html(' <span style="color:#ccc">'+msg+'</span>');
        $('.'+id1+'-f1').addClass("yellow");
    }
}

var isValidCardId = function(id) {
    if(! /\d{17}[\dxX]/.test(id)) {
        return false;
    }
    var modcmpl = function(m, i, n) { return (i + n - m % i) % i; },
        f = function(v, i) { return v * (Math.pow(2, i-1) % 11); },
        s = 0;
    for(var i=0; i<17; i++) {
        s += f(+id.charAt(i), 18-i);
    }
    var c0 = id.charAt(17),
        c1 = modcmpl(s, 11, 1);
    return c0-c1===0 || (c0.toLowerCase()==='x' && c1===10);
}

var calculateAge = function (birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var checkIdNumberWhiteList = function(idNumber){
    var res = false;
    $.ajax({
        cache: false,
        type: "POST",
        url: api_url + "/public/whiteList/validate",
        data: "idNumber=" + idNumber,
        dataType:"json",
        async: false,
        error: function(request) {
            console.log("whiteList idNumber check error");
        },
        success: function(data) {
            if(data.code == 'SUCCESS'){
                res=true;
            }else{
                res=false;
            }
        }
    });
    return res;
}

var isExistedCardId = function(cardId) {
    var result;

    jQuery.ajax({
        type : "POST",
        contentType : "text/plain",
        url : api_url + "/public/cfd/account/is-existed-id.json",
        data : cardId,
        async : false,
        success : function(data) {
            result = data;
        },
        error : function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus + errorThrown);
        }
    });

    return result;
}

function refreshCaptcha(img){
    var date = new Date();
    img.src = id_url+"/cn/pc/img?t=" + date;

    img.display ='';
}



$(function () {

    $('.try a').click(function(){
        $('#loginKuang').hide();
    });

    //加载验证码方法
    $('.btn-phonecode').click(function(){
        if ($(this).hasClass('disabled')) {
            return false;
        }
        var phone=$.trim($('#phone').val());
        var upwd=$.trim($('#upwd').val());
        var pcyanz = $.trim($('#pc-yanZ').val());
        if(!createCfdAccount.validatePhone("phone",phone)){
            return;
        }
        if(!isDemo){
            if(!createCfdAccount.validatePassword("upwd",upwd)){
                return;
            }
        }

        var index = parseInt(cookieInfo.getCookie("getyzCodeIndex")==null?0:cookieInfo.getCookie("getyzCodeIndex"));
        if(index>=3){
            //显示验证码
            $(".yzmhideinfo").show();
        }else{
            index+=1;
        }

        if($(".yzmhideinfo").is(':visible')){
            if(!createCfdAccount.validateImageNo("pc-yanZ",pcyanz)){
                return;
            }
        }

        if(createCfdAccount.generatePhoneCaptcha("yanZ",phone,pcyanz)){
            $('.yanZ-tip').html('<span style="color: #5ca500" >验证码已发送,请查收! </span>');
            cookieInfo.setCookie("getyzCodeIndex",index);

            $(this).css({
                "display":"none"
            });
            $('.re-btn').css({
                "display":"block"
            })
            $(this).addClass("disabled");
            var second= 60;
            var interval = setInterval(function() {
                if (second > 0) {
                    second--;
                    $("#secendhtml").html(second + 'S');
                } else {
                    $(".btn-phonecode").css({
                        "display":"block"
                    });
                    $('.re-btn').css({
                        "display":"none"
                    })
                    $(".btn-phonecode").removeClass('disabled');
                    clearInterval(interval);
                }
            }, 1000);
        }
    })
});

function pCheck(){
    check=$.trim($('#pc-yanZ').val());
    if(!check){//为空
        $('.pc-tip').html('<span class="cError-k"><em></em>验证码不能为空!</span>');
        $('.form-item4').css({
            "border-color":"#ef392b"
        });
        return false;
    }

    jQuery.ajax({
        type : "POST",
        url : "/checkImageCaptcha.do",
        data : "code=" + $("#pc-yanZ").val(),
        async : false,
        success : function(data) {
            if (!data.status) {
                $('.pc-tip').html('<span class="cError-k"><em></em>填写验证码不正确!</span>');
                $('.form-item4').css({
                    "border-color":"#ef392b"
                });
                return false;
            } else {
                $('.pc-tip span').hide();
                $('.form-item4').css({
                    "border-color":"#5ca500"
                });
                return true;
            }
        },
        error : function() {
            //showError(errorId, '服务器错误，请重试');
        }
    });
}

/**larry code*/
var createCfdAccount = {
    /**
     * 验证白名单
     * @param phone
     * @returns {boolean}
     */
    checkPhoneWhiteList:function (phone) {
        var res = false;
        $.ajax({
            cache: false,
            type: "POST",
            url: api_url + "/public/whiteList/validate",
            data: "phone=" + phone,
            dataType:"json",
            async: false,
            error: function(request) {
                console.log("whiteList phone check error");
            },
            success: function(data) {
                if(data.status == 'SUCCESS'){
                    res=true;
                }else{
                    res=false;
                }
            }
        });
        return res;
    },
    /**
     * 验证手机号是否存在
     * @param isDemo
     * @param phone
     * @returns {*}
     */
    isExistedPhone:function(isDemo, phone) {
        var result;
        var path = isDemo ? "/public/cfd/demo/is-existed-phone.json" : "/public/cfd/account/is-existed-phone.json";

        jQuery.ajax({
            type : "POST",
            contentType : "text/plain",
            url : api_url + path,
            data : phone,
            async : false,
            success : function(data) {
                result = data;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus + errorThrown);
            }
        });
        return result;
    },
    /**
     * 验证手机号是否存在
     * @param isDemo
     * @param phone
     * @returns {*}
     */
    isExistedEmail:function(isDemo, phone) {
        var result;
        var path = isDemo ? "/public/cfd/demo/is-existed-email.json" : "/public/cfd/account/is-existed-email.json";

        jQuery.ajax({
            type : "POST",
            contentType : "text/plain",
            url : api_url + path,
            data : phone,
            async : false,
            success : function(data) {
                result = data;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus + errorThrown);
            }
        });
        return result;
    },
    /**
     * 验证手机号
     * @param phone
     * @returns {boolean}
     */
    validatePhone:function (div,phone) {
        var regPhone=/^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
        if(!phone){//为空
            messageInfo.info(div,"手机号码不能为空!");
            return false;
        }else if(!regPhone.test(phone)){//格式不正确
            messageInfo.info(div,"请输入正确的手机号格式");
            return false;
        }else if(!this.checkPhoneWhiteList(phone)){
            //已被注册
            var result = this.checkCustomerByPhone(phone,isDemo);
            if(result&&result.code!=1){
                $(".phone-tip").css("height",'0.8rem');
                $(".pc-tip-phone").css("height",'50px');
                messageInfo.info(div,result.msg);
                return false;
            }else{
                $(".phone-tip").css("height",'0.6rem');
                $(".pc-tip-phone").css("height",'40px');
                messageInfo.success(div);
                return true;
            }
        }else{//成功
            messageInfo.success(div);
            return true;
        }
    },
    /**
     * 验证密码
     * @param div
     * @param upwd
     * @returns {boolean}
     */
    validatePassword:function (div, upwd) {
        var regex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;
        if(!upwd){//为空
            messageInfo.info(div,"密码不能为空!");
            return false;
        }else if(!regex.test(upwd)){//格式不正确
            messageInfo.info(div,"密码为8位字符，必须包含字母和数字!");
            return false;
        }else{
            messageInfo.success(div);
            return true;
        }
    },
    /**
     * 验证手机号验证码
     * @param div
     * @param No
     */
    validatePhoneVNo:function (div,yanZ,phone) {
        if(!yanZ){//为空
            messageInfo.info(div,"手机验证码不能为空!");
            return false;
        }
        if(!this.validatePhoneVNoByAjax(yanZ,phone)){
            // 手机验证码不正确
            messageInfo.info(div,"手机验证码不正确!");
            return false;
        }else{
            messageInfo.success(div);
            return true;
        }
    },
    validatePhoneVNoByAjax:function (yanZ,phone) {
        var yzPd = false;
        jQuery.ajax({
            type : "POST",
            url : id_url+"/cn/pc/checkPhoneCaptcha",
            data : "code=" + yanZ+"&phone="+phone,
            async : false,
            xhrFields: {
                      withCredentials: true
            },
            crossDomain:true,
            success : function(data) {
                if (data.code==1) {
                    yzPd = true;
                }
            },
            error : function() {
            }
        });
        return yzPd;
    },
    /**
     * 发送验证码
     * @param div
     * @param phone
     * @returns {boolean}
     */
    generatePhoneCaptcha : function (div,phone,imageCaptcha) {
        var result = false;
        jQuery.ajax({
            type : "POST",
            url : id_url+"/cn/pc/getPhoneCaptcha",
            data : "phone=" + phone+"&imageCaptcha="+imageCaptcha,
            async : false,
            xhrFields: {
                      withCredentials: true
            },
            crossDomain:true,
            success : function(data) {
                if (data.code == 200) {
                    result = true;
                } else {
                    messageInfo.info(div,data.ch_msg);
                }
            },
            error : function() {
                //showError(captchaErrorId, "服务器错误，请重试");
            }
        });
        return result;
    },
    /**
     * 验证图片验证码
     * @param div
     * @param check
     * @returns {boolean}
     */
    validateImageNo:function (div,check) {
        var result = false;
        if(!check){//为空
            messageInfo.info(div,"验证码不能为空！");
        }
        jQuery.ajax({
            type : "POST",
            url : id_url+"/cn/pc/checkImageCaptcha",
            data : "code=" + check,
            async : false,
            xhrFields: {
                      withCredentials: true
              },
            crossDomain:true,
            success : function(data) {
                if (data.code!=1) {
                    if(data.code==-2){
                        refreshCaptcha($(".yz-code").find("img")[0]);
                        messageInfo.info(div,"填写已过期、请重新输入");
                        return;
                    }
                    messageInfo.info(div,"填写验证码不正确！");
                } else {
                    messageInfo.success(div);
                    result = true;
                }
            },
            error : function() {
                messageInfo.info(div,"服务器错误，请重试！");
            }
        });
        return result;
    },
    /**
     * 验证真实姓名
     * @param div
     * @param name
     * @returns {boolean}
     */
    validateUserName:function (div, name) {
        var regPhone=/^[A-Z, a-z, \u0391-\uFFE5]+$/;
        if(!name){//为空
            messageInfo.info(div,"真实姓名不能为空！");
            return false;
        }else if(!regPhone.test(name)){//格式不正确
            messageInfo.info(div,"真实姓名只能为中文或英文！");
            return false;
        }else{//成功
            messageInfo.success(div);
            return true;
        }
    },
    /**
     * 身份证验证
     * @param div
     * @param idCard
     * @returns {boolean}
     */
    validateIdCard:function (div, idCard) {
        var regex=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!idCard){//为空
            messageInfo.info(div,"身份证号不能为空！");
            return false;
        }
        if(!regex.test(idCard)){//格式不正确
            messageInfo.info(div,"身份证号格式不正确！");
            return false;
        }
        if(!isValidCardId(idCard)){
            messageInfo.info(div,"身份证不正确！");
            return false;
        }
        var birthday = new Date(idCard.substring(6, 10), idCard.substring(10, 12), idCard.substring(12, 14));
        if(calculateAge(birthday) < 18) {
            messageInfo.info(div,"您没到18岁！");
            return false;
        }
        if(checkIdNumberWhiteList(idCard)){	//身份证白名单校验
            messageInfo.success(div);
            return true;
        }
        if(isExistedCardId(idCard)) {
            messageInfo.info(div,"身份证已经存在，请更换身份证再注册!");
            return false;
        } else {
            messageInfo.success(div);
            return true;
        }
    },
    /**
     * 验证邮箱
     * @param div
     * @param email
     * @returns {boolean}
     */
    validateEmail:function (div, email) {
        var regEmail =  /^[a-z0-9-.]{1,30}@[a-z0-9-]{1,65}\.[a-z]{2,5}$/;
        if(!email){//为空
            messageInfo.info(div,"邮箱不能为空！");
            return false;
        }else if(!regEmail.test(email)){//格式不正确
            messageInfo.info(div,"邮箱格式不正确！");
            return false;
        }else if(this.isExistedEmail(isDemo,email)){
            messageInfo.info(div,"该邮箱已存在！");
            return false;
        }else{
            messageInfo.success(div);
            return true;
        }
    },
    sendNotifyMsg:function (div,phone) {
        var result = false;
        var tracker = initTracker();
        var driverType = $("input[name='tracker.driverType']").val();
        var obj = {
            "tracker.unique":tracker.unique,
            "tracker.hostname":tracker.hostname,
            "tracker.referrer":tracker.referrer,
            "tracker.href":tracker.href,
            "tracker.driverType":driverType,
            "tracker.phone":phone
        }

        // tracker.driverType = $("input[name='tracker.driverType']").val();
        jQuery.ajax({
            type : "POST",
            url : "/cn/pc/sendNotifyMsg",
            data : obj,
            async : false,
            success : function(data) {
                if (data.code==1) {
                    result = true;
                } else {
                    messageInfo.info(div,"发送失败,请联系在线客服！");
                }
            },
            error : function() {
                //showError(captchaErrorId, "服务器错误，请重试");
            }
        });
        return result;
    },
    showerrorMsg:function(){
        if(cookieInfo.getCookie("errorphone")!=null&&cookieInfo.getCookie("errorphone")!=""){
            $(".errortipinfo").html("手机号已存在，请重新注册！");
        }
        cookieInfo.delCookie("errorphone");
    },
    checkCustomerByPhone:function (phone,isDemo) {
        var result;
        //var path = isDemo ? "/public/cfd/demo/is-existed-phone.json" : "/public/cfd/account/is-existed-phone.json";
        jQuery.ajax({
            type : "POST",
            // contentType : "text/plain",
            url : api_url + "/public/cfd/account/checkCustomerByPhone",
            data : {phone:phone,isDemo:isDemo},
            // dataType:"application/json",
            async : false,
            success : function(data) {
                result = data;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus + errorThrown);
            }
        });
        return result;
    }
};

var cookieInfo = {
		getsec:function(str){
			alert(str);
		    var str1=str.substring(1,str.length)*1;
		    var str2=str.substring(0,1);
		    if (str2=="s")
		    {
		    	return str1*1000;
		    }
		    else if (str2=="h")
		    {
		    	return str1*60*60*1000;
		    }
		    else if (str2=="d")
		    {
		    	return str1*24*60*60*1000;
		    }
		},
		setCookie:function(name,value){
		    var Days = 30;
		    var exp = new Date();
		    exp.setTime(exp.getTime() + Days*24*60*60*1000);
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	    },
	    getCookie:function(name){
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg))
		    return unescape(arr[2]);
		    else
		    return null;
	    },
	    delCookie:function(name){
		    var exp = new Date();
		    exp.setTime(exp.getTime() - 1);
		    var cval=cookieInfo.getCookie(name);
		    if(cval!=null)
		    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	    }

	}
var jsonpData=function(options,callbackSuc,callbackErr)
{
    if(!options.type){
        options.type = "get";
    }
    return $.ajax({
        type : options.type,
        url : options.url,
        data:options.data,
        dataType : "jsonp",//数据类型为jsonp
        jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数
        success : function(data){
            if($.isFunction(callbackSuc))callbackSuc(data);},
        error:function(){if($.isFunction(callbackErr))callbackErr(); }
    });
}




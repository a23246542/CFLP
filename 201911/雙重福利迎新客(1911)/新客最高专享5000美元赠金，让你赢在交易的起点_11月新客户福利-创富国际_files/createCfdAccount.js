var StringUtils = {
    isEmpty:function (str) {
        return str==null||str=="";
    }
}

function initTracker() {
    var result = {
        unique : new Date().getTime(),
        hostname : window.location.hostname,
        referrer : document.referrer,
        href : window.location.href
    }
    if(result.referrer==null||result.referrer==""){
        result.referrer=window.location.href;
    }
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

var calculateAge = function (idCard) { // birthday is a date
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - idCard.substring(6, 10) - 1;
    if (idCard.substring(10, 12) < month || idCard.substring(10, 12) == month && idCard.substring(12, 14) <= day) {
        age++;
    }
    return age;
}

var checkIdNumberWhiteList = function(idNumber){
    var res = false;
    $.ajax({
        cache: false,
        type: "POST",
        url: apiUrl + "/public/whiteList/validate",
        data: "idNumber=" + idNumber,
        dataType:"json",
        async: false,
        error: function(request) {
            console.log("whiteList idNumber check error");
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
}

var isExistedCardId = function(cardId) {
    var result;

    jQuery.ajax({
        type : "POST",
        contentType : "text/plain",
        url : apiUrl + "/public/cfd/account/is-existed-id.json",
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

$(function () {

    $('.try a').click(function(){
        $('#loginKuang').hide();
    });

    $('.pass-icon').click(function(){
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $("#upwd").attr('type',"text")
        }else{
            $("#upwd").attr('type',"password")
        }
    })

    /*$("input").keyup(function () {
        $(this).val($(this).val().trim());
    })*/
});

/**larry code*/
var createCfdAccount = {
    /**
     * 验证白名单
     * @param phone
     * @returns {boolean}
     */

    checkPhoneWhiteList:function (phone,email) {
        var res = false;
        jQuery.support.cors = true;
        $.ajax({
            cache: false,
            type: "POST",
            // crossDomain: true,
            url: apiUrl + "/public/whiteList/validate",
            data: "phone=" + phone+"&email="+email,
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
            url : apiUrl + path,
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
        if(!this.checkPhoneWhiteList("",phone)){
            jQuery.ajax({
                type : "POST",
                contentType : "text/plain",
                url : apiUrl + path,
                data : phone,
                async : false,
                success : function(data) {
                    result = data;
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + errorThrown);
                }
            });
        }

        return result;
    },
    /**
     * 验证手机号
     * @param phone
     * @returns {boolean}
     */
    phonePd:false,
    validatePhone:function (div,phone) {
        var regPhone=/^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
        if(!phone){//为空
            messageInfo.info(div,"手机号码不能为空!");
            this.phonePd = false;
            return false;
        }else if(!regPhone.test(phone)){//格式不正确
            messageInfo.info(div,"请输入正确的手机号格式");
            this.phonePd = false;
            return false;
        }else if(!this.checkPhoneWhiteList(phone,"")){//已被注册
            var result = this.checkCustomerByPhone(phone,isDemo);
            if(result&&result.code!=1){
                $(".phone-tip").css("height",'0.8rem');
                $(".pc-tip-phone").css("height",'50px');
                messageInfo.info(div,result.msg);
                this.phonePd = false;
                return false;
            }else{
                $(".phone-tip").css("height",'0.6rem');
                $(".pc-tip-phone").css("height",'40px');
                messageInfo.success(div);
                this.phonePd = true;
                return true;
            }
        }else{//成功
            messageInfo.success(div);
            this.phonePd = true;
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
        var regex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/;
        if(!upwd){//为空
            messageInfo.info(div,"密码不能为空!");
            return false;
        }
        if(!regex.test(upwd)){//格式不正确
            messageInfo.info(div,"密码为5-16位字符，必须包含字母和数字!");
            return false;
        }
        messageInfo.success(div);
        return true;
    },
//  验证推荐号码
    validateRecommendNo:function(div,recommend){
    	 var regPhone=/^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
    	  if(!recommend){//为空
     //   messageInfo.info(div,"");
              return false;
          }else if(!regPhone.test(recommend)){//格式不正确
    		 messageInfo.info(div,"请输入正确的手机号格式");
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
    yanZPd:false,
    validatePhoneVNo:function (div,yanZ,phone) {
        if(!yanZ){//为空
            messageInfo.info(div,"手机验证码不能为空!");
            this.yanZPd = false;
            return false;
        }
        if(!this.validatePhoneVNoByAjax(yanZ,phone)){
            // 手机验证码不正确
            messageInfo.info(div,"手机验证码不正确!");
            this.yanZPd = false;
            return false;
        }else{
            messageInfo.success(div);
            this.yanZPd = true;
            return true;
        }
    },
    validatePhoneVNoByAjax:function (yanZ,phone) {
        var yzPd = false;
        jQuery.ajax({
            type : "POST",
            url : ac_url+"/cn/pc/checkPhoneCaptcha",
            data : "phoneCaptcha=" + yanZ+"&phone="+phone,
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
    generatePhoneCaptcha : function (div,pram) {
        var result = false;
        jQuery.ajax({
            type : "POST",
            url : ac_url+"/gt/validate_no",
            data : pram,
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
                messageInfo.info(div,"发送失败,请联系 <a href='javascript:;' onclick='openLive800()'>在线客服</a>！");
            }
        });
        return result;
    },
    validateUserNameLocal:function (div, name) {
        var regPhone=/^[A-Z, a-z,·, \u0391-\uFFE5]+$/;
        if(!name){//为空
            messageInfo.info(div,"真实姓名不能为空！");
            return false;
        }
        if(!regPhone.test(name)){//格式不正确
            messageInfo.info(div,"真实姓名只能为中文或英文！");
            return false;
        }
        messageInfo.success(div);
        return true;
    },
    /**
     * 验证真实姓名
     * @param div
     * @param name
     * @returns {boolean}
     */
    validateUserName:function (div, name,idNumber) {
        if(!this.validateUserNameLocal(div,name)){
            return false;
        }
        messageInfo.success(div);
        if(idNumber){
            var phone = $("#mobile_Phone").val();
            return createCfdAccount.validateIdCard("idCard",idNumber,name,phone);
        }
        return true;
    },
    validateIdCard2:function(idNumber,chineseName,phone){
        var result;
        jQuery.ajax({
            type : "POST",
            url : "/cn/pc/validateIdCard",
            data : "idNumber=" + idNumber+"&chineseName="+chineseName+"&phone="+phone,
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
     * 身份证验证
     * @param div
     * @param idCard
     * @returns {boolean}
     */
    validateIdCardPd:false,
    validateIdCard:function (div, idCard,chineseName,phone) {
        var regex=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!idCard){//为空
            messageInfo.info(div,"身份证号不能为空！");
            this.validateIdCardPd = false;
            return false;
        }
        if(!regex.test(idCard)){//格式不正确
            messageInfo.info(div,"身份证号格式不正确！");
            this.validateIdCardPd = false;
            return false;
        }
        if(!isValidCardId(idCard)){
            messageInfo.info(div,"身份证不正确！");
            this.validateIdCardPd = false;
            return false;
        }

        if(calculateAge(idCard) < 18) {
            messageInfo.info(div,"您没到18岁！");
            this.validateIdCardPd = false;
            return false;
        }
        //身份证统一转大写
        idCard = idCard.toUpperCase();

        if(this.validateUserNameLocal("uname",chineseName)){
            var result = this.validateIdCard2(idCard,chineseName,phone);
            if(result&&result.code!=200){
                messageInfo.info(div,result.code_desc);
                this.validateIdCardPd = false;
                return false;
            }
        }
        messageInfo.success(div);
        this.validateIdCardPd = true;
        return true;
    },
    /**
     * 验证邮箱
     * @param div
     * @param email
     * @returns {boolean}
     */
    validateEmailPd:false,
    validateEmail:function (div, email) {
        var regEmail =  /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
        if(!email){//为空
            messageInfo.info(div,"邮箱不能为空！");
            this.validateEmailPd = false;
            return false;
        }else if(!regEmail.test(email)){//格式不正确
            messageInfo.info(div,"邮箱格式不正确！");
            this.validateEmailPd = false;
            return false;
        }else if(this.isExistedEmail(isDemo,email)){
            messageInfo.info(div,"该邮箱已存在！");
            this.validateEmailPd = false;
            return false;
        }else{
            messageInfo.success(div);
            this.validateEmailPd = true;
            return true;
        }
    },
    sendNotifyMsg:function (div,phone) {
        var result = false;
        var tracker = initTracker();
        var driverType = $("input[name='tracker.driverType']").val();
        var obj = {
            "tracker.uniques":tracker.unique,
            "tracker.hostname":tracker.hostname,
            "tracker.referrer":tracker.referrer,
            "tracker.href":tracker.href,
            "tracker.driverType":driverType,
            "tracker.phone":phone
        }

        jQuery.ajax({
            type : "POST",
            url : ac_url+"/cn/pc/sendNotifyMsg",
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
        jQuery.ajax({
            type : "POST",
            url : apiUrl + "/public/cfd/account/checkCustomerByPhone",
            data : {phone:phone,isDemo:isDemo,url:window.location.href},
            async : false,
            success : function(data) {
                result = data;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                result = {
                    code:-1,
                    msg:"服务器出错、请联系<a href='javascript:;' onclick='openLive800()'>在线客服</a>"
                };
                console.log(textStatus + errorThrown);
            }
        });
        return result;
    }
}

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
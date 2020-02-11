//右下角
$('.count-type-d a').click(function(){
    $(this).addClass('active1').siblings('.active1').removeClass('active1')
});

//验证

$(function(){
    var phone,upwd,yanZ,check;
    // var messageInfo = new messageInfo();
    $('#phone').focus(phoneCheck1);
    $('#upwd').focus(upwdCheck1);
    $('#yanZ').focus(yanCheck1);
    $('#pc-yanZ').focus(pCheck1);

    if(isDemo){
        $('#uname').focus(unameCheck2);
        // $('#email').focus(emailCheck2);
    }

    function phoneCheck1(){
        messageInfo.alert("phone","*该手机号码可用于验证，请正确填写");
        $('.pError-k,.pError-g,.pError-r').css({
            "display":"none"
        });

    }
    function upwdCheck1(){
        messageInfo.alert("upwd","*该密码为8位字符，必须包含字母和数字");
        $('.uError-k,.uError-g').css({
            "display":"none"
        });
    }
    function yanCheck1(){
        $('.form-item3').css({
            "border-color":"#ffa000"
        });
        $('.yError-k').css({
            "display":"none"
        });
    }

    function pCheck1(){
        messageInfo.alert("pc-yanZ","*请输入验证码");
        $('.cError-k').css({
            "display":"none"
        });
    }
    function unameCheck2(){
        messageInfo.alert("uname","*请输入您的姓名");
        $('.uError-k,.uError-g').css({
            "display":"none"
        });
    }
    function  emailCheck2(){
        messageInfo.alert("email","*请输入您的常用邮箱");
        $('.eError-k,.eError-g').css({
            "display":"none"
        });

    }

    //失去焦点
    $('#phone').blur(function () {
        var phone=$.trim($('#phone').val());
        createCfdAccount.validatePhone("phone",phone);
    });

    $('#upwd').blur(function () {
        var upwd=$.trim($('#upwd').val());
        createCfdAccount.validatePassword("upwd",upwd);
    });

    $('#yanZ').blur(function () {
        var yanZ=$.trim($('#yanZ').val());
        var phone=$.trim($('#phone').val());
        createCfdAccount.validatePhoneVNo("yanZ",yanZ,phone);
    });
    $('#pc-yanZ').blur(function () {
        var check = $.trim($('#pc-yanZ').val());
        createCfdAccount.validateImageNo("pc-yanZ",check);
    });

    //模拟开户
    if(isDemo){
        $('#uname').blur(function () {
            uname=$.trim($('#uname').val());
            createCfdAccount.validateUserName("uname",uname);
        });
        $('#email').blur(function () {
            email=$.trim($('#email').val());
            createCfdAccount.validateEmail("email",email);
        });
    }

    $("#submitInfo").click(function () {

        //需要禁用按钮

        var phone=$.trim($('#phone').val());
        var upwd=$.trim($('#upwd').val());
        var yanZ=$.trim($('#yanZ').val());
        var check = $.trim($('#pc-yanZ').val());

        var phonePd = createCfdAccount.validatePhone("phone",phone);
        if(!phonePd){
            return;
        }
        var upwdPd = createCfdAccount.validatePassword("upwd",upwd);
        if(!upwdPd){
            return;
        }
        var yanZPd = createCfdAccount.validatePhoneVNo("yanZ",yanZ,phone);
        // var pcPd = createCfdAccount.validateImageNo("pc-yanZ",check);
        if(!yanZPd){
            return;
        }

        var display =$(".yzmhideinfo").css('display');
        if(display&&display != 'none'){
            var pcpd = createCfdAccount.validateImageNo("pc-yanZ",check);
            if(!pcpd){
                return;
            }
        }
        ga('send', 'event', 'acc', 'dianji', 'rfinish_acc', '1');
        setToHiddenFields(initTracker());
        // _taq.push({convert_id:"67531761935", event_type:"form"});
        $("#submitForm").submit();
    });

    $("#submitInfobyTrial").click(function () {
        if($(this).attr("disabled")!=null){
            return;
        }
        var phone=$.trim($('#phone').val());
        var yanZ=$.trim($('#yanZ').val());
        var check = $.trim($('#pc-yanZ').val());
        var uname=$.trim($('#uname').val());
        var email=$.trim($('#email').val());

        var pd1 = createCfdAccount.validateUserName("uname",uname);
        if(!pd1){
            //$(this).removeAttr("disabled");
            return;
        }

        var phonePd = createCfdAccount.validatePhone("phone",phone);
        if(!phonePd){
            return;
        }

        // var pd3 = createCfdAccount.validateEmail("email",email);
        // if(!pd3){
        //     //$(this).removeAttr("disabled");
        //     return;
        // }


        var yanZPd = createCfdAccount.validatePhoneVNo("yanZ",yanZ,phone);
        if(!yanZPd){
            //$(this).removeAttr("disabled");
            return;
        }

        var display =$(".yzmhideinfo").css('display');
        if(display&&display != 'none'){
            var pcpd = createCfdAccount.validateImageNo("pc-yanZ",check);
            if(!pcpd){
                //$(this).removeAttr("disabled");
                return;
            }
        }

        //$(this).removeAttr("disabled");

        ga('send', 'event', 'acc', 'dianji', 'rfinish_acc', '1');
        setToHiddenFields(initTracker());
        $(this).attr("disabled","disabled");
        $(this).css("background","#ccc");
        _taq.push({convert_id:'1597884522464269', event_type:'form'});
        $("#submitForm").submit();
    });
})

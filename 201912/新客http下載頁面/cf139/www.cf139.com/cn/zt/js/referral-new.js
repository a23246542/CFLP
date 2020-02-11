

$(function() {
    $('.recode').click(function(){
        $("#upwd,#pc_yanZ").val('').removeClass('success').removeClass('error');
        $('.input-tip').html('');
        $("#code").attr("src",id_url+"/cn/pc/img?r="+Math.random());
        $("#loginKuang1").show();

    });
//手机号码
$('#phone').blur(function () {
    var phone=$.trim($('#phone').val());
    createCfdAccount.validatePhone("phone",phone);
});
    $('#phonee').blur(function () {
        var phonee=$.trim($('#phonee').val());
        createCfdAccount.validatePhonee("phonee",phonee);
    });
$('#phone').focus(phoneCheck);
    function phoneCheck(){
        messageInfo.alert("phone");
    }
    $('#phonee').focus(phoneeCheck);
    function phoneeCheck(){
        messageInfo.alert("phonee");
    }
    //密码
    $('#upwd').blur(function () {
        var upwd=$.trim($('#upwd').val());
        createCfdAccount.validatePassword("upwd",upwd);
    });
    //图片验证码

    $('#upwd').focus(upwdCheck);
    function upwdCheck(){
        messageInfo.alert("upwd");
    }

var createCfdAccount = {
    validatePhone: function (div, phone) {
        // var regPhone = /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
        if (!phone) {//为空
            messageInfo.info(div, "手机号码不能为空!");
            return false;
        } else {//成功
            messageInfo.success(div);
            return true;
        }
    },
    validatePhonee: function (div, phonee) {
        // var regPhone = /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
        if (!phonee) {//为空
            messageInfo.info(div, "手机号码不能为空!");
            return false;
        } else {//成功
            messageInfo.success(div);
            return true;
        }
    },
     validatePassword: function (div, upwd) {
         var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;
         if (!upwd) {//为空
             messageInfo.info(div, "密码不能为空!");
             return false;
         } else {
             messageInfo.success(div);
             return true;
         }
     },

};
var messageInfo ={
    info:function (id,msg) {
        $('.'+id+'-tip').html(' <span><em></em>'+msg+'</span>');
        $('.'+id+'-f1').addClass("error").removeClass("blue");
    },
    success:function (id) {
        $('.'+id+'-tip span').hide();
        $('.'+id+'-f1').removeClass("blue").addClass("success");
    },
    alert:function (id) {
        // $('.'+id+'-tip').html(' <span style="color:#ccc">'+msg+'</span>');
        $('.'+id+'-f1').addClass("blue").removeClass("error");
    }
};
//记录查询
    $("#confirm1").click(function(){
        toPage();
    })
    var toPage = function () {
        //验证
        if ($("#phonee,#upwd").hasClass("error")||$("#phonee,#upwd").val()=='') {
            $('.error-info').html("请将信息填写完整");
        }

        $('.error-info').hide();
        var tmp = $("#phonee").val();
        var tmpS= $("#phonee").val().toString();
        var pram = {};
        pram.password =$("#upwd").val();
        if(tmpS.length==11){
            pram.phone = tmp;
        }else{
            pram.account = tmp;
        }
        $.ajax({
            type : "POST",
            url : mis_url + "/public/cfd/account/toRecommendActivity",
            data : pram,
            async : false,
            success : function(data) {
                if(data.code==-1){
                    $('.error-info').html(data.data.error.message).show();
                }else{
                    // window.location.href = data.data;
                    //ToDo
                    $('#loginKuang1').hide();
                    window.open(data.data);
                }
                console.log(data)
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus + errorThrown);
            }
        });
    }

//链接查询

$("#confirm").click(function(){
    if ($("#phone").val()=='') {
        messageInfo.info( 'phone', "请将信息填写完整");
        return
    }
    toCopy();
    $(".layout-22").show();
    $(".login .layout-2").hide();
});
function toCopy(){
    if ($("#phone").val()=='') {
        messageInfo.info( 'phone', "请将信息填写完整");
        return
    }
    var phone = $("#phone").val().toString();
    $.post( mis_url + "/public/cfd/customerRelation/getRelationUrlByPhone",{phone:phone},function (data) {
        $(".layout-22").hide();
        $(".login .layout-2").show();
        if(data.code!=1){
            if(data.msg == "该手机号未开通CFD真实账户，不存在推荐链接"){
                $("#copied").val("");
                messageInfo.info( 'phone', "此手机号尚未注册真实账号，请点击此处<a class='item-b user user-m' onclick='interChange()'>注册</a>");
            }
            return;
        }
        $(".phone-tip").html("");
        $("#copied").val(data.msg);
    })
}

});
//复制链接功能

function copyToClipboard(elem) {
// create hidden text element, if it doesn't already exist
    var targetId = "copied";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
// can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
// must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
// select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
// copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
// restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    if (isInput) {
// restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
// clear temporary content
        target.textContent = "";
    }
    return succeed;
}
//提示文字
var layer=document.createElement("div");
layer.id="layer";
function func()
{
    var style=
        {
            position:"absolute",
            zIndex:10,
            width:"70px",
            height:"20px",
            right:"22px",
            top:"29px",
            fontSize:"14px",
            color:"#666"
        };
    for(var i in style)
        layer.style[i]=style[i];
    if( $("#copied").val()!=="") {
        document.getElementById("copy").appendChild(layer);
        // document.body.appendChild(layer);
        layer.innerHTML="复制成功";
        setTimeout("document.getElementById(\"copy\").removeChild(layer)",2000)
    }else{
        messageInfo.info( 'phone', "请填入您的手机号");
    }
}
//提示文字
function  func1(){
    var layer1=document.createElement("div");
    layer1.id="layer1";
    var style=
        {
            position:"absolute",
            zIndex:10,
            width:"70px",
            height:"20px",
            right:"3px",
            top:"40px",
            fontSize:"14px",
            color:"#666"
        };
    for(var i in style)
        layer1.style[i]=style[i];
    if( $("#copied").val()!=="") {
        document.getElementById("copy").appendChild(layer1);
        // document.body.appendChild(layer);
        layer1.innerHTML="复制成功";
        setTimeout("$('#layer1').html('')",2000)
    }else{
        messageInfo.info( 'phone', "请填入您的手机号");
    }
}
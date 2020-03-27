$(function () {
    var validateInfo = function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        var phone=$.trim($('#phone').val());
        var upwd=$.trim($('#upwd').val());
        if(!createCfdAccount.validatePhone("phone",phone)){
            return false;
        }

        if(!createCfdAccount.validatePassword("upwd",upwd)){
            return false;
        }

        return true;
    }

    var handler = function (captchaObj) {
        // 将验证码加到id为captcha的元素里，同时会有三个input的值用于表单提交
        captchaObj.onReady(function () {
        }).onSuccess(function () {
            var result = captchaObj.getValidate();
            if (!result) {
                return alert('请完成验证');
            }
            var phone=$.trim($('#phone').val());
            result.phone = phone;
            result.receiveTunnel = $("#receiveTunnel").val();
            result.hiddenurl = $.trim($("input[name='hiddenurl']").val());
            if(createCfdAccount.generatePhoneCaptcha("yanZ",result)){
                $('.yanZ-tip').html('<span style="color: #5ca500" >验证码已发送,请查收! </span>');
                $(".voice-check").hide();
                $(".btn-phonecode").hide();
                $('.re-btn').show();
                $(".btn-phonecode").addClass("disabled");
                var second= 60;
                var interval = setInterval(function() {
                    if (second > 0) {
                        second--;
                        $("#secendhtml").html(second + 'S');
                    } else {
                        $(".btn-phonecode").show();
                        $('.re-btn').hide();
                        $(".voice-check").show();
                        $(".btn-phonecode").removeClass('disabled');
                        clearInterval(interval);
                    }
                }, 1000);
            }
        })

        var sendCode = function () {
            // 调用之前先通过前端表单校验
            if(validateInfo()){
                captchaObj.verify();
            }
        }

        $('.btn-phonecode').click(function () {
            $("#receiveTunnel").val(0);//普通短信方式
            sendCode();
        });

        $(".voice-check").click(function () {
            $("#receiveTunnel").val(2);//语音验证方式
            sendCode();
        });
    };

    $.ajax({
        url: ac_url+"/gt/register?t=" + (new Date()).getTime(), // 加随机数防止缓存
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain:true,
        success: function (data) {
            // 调用 initGeetest 进行初始化
            // 参数1：配置参数
            // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
            initGeetest({
                // 以下 4 个配置参数为必须，不能缺少
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success, // 表示用户后台检测极验服务器是否宕机
                new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
                product: "bind", // 产品形式，包括：float，popup
                width: "300px"
            }, handler);
        }
    });
})
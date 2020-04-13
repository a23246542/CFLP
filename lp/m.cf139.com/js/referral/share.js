/**分享相关代码--larry*/
img_url = "https://sc.tfejy.com"


//加载script
$.loadScript = function (url, callBack) {
    var head = document.getElementsByTagName("HEAD").item(0);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (callBack != null) {
        script.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                callBack();
            }
        }
        script.onload = callBack;
    }
    //script.onloadend = callBack;
    head.appendChild(script);
}

/**获取参数*/
var getPram = function (name) {
    var search = window.location.search;
    var str = null;
    if (search.length > 0) {
        var arr = search.split("&");
        for (var i = 0; i < arr.length; i++) {
            var tmp = arr[i];
            if (tmp.indexOf(name) != -1) {
                str = tmp.substring(tmp.indexOf(name) + name.length + 1);
            }
        }
    }
    if (str == null) {
        str = $("#code").val();
    }
    return str;
}


//二维码图片
var createImg = function (url) {

    $("#qrImg").qrcode({text: url});
    $("#qr-popup").qrcode({text: url});
}

var nativeShare = null;//分享对象
var imgUrl = mis_url + "/public/customerRelation/createImage";
var getPhoneByAccountUrl = info_url + "/getNewRep";
var getPhoneByAccount = mis_url + "/public/customerRelation/getPhoneByAccount"
var phoneCodeData = ""
//加载回调
var createNativeShare = function () {
    //创建分享对象、验证是否有默认分享配置
    nativeShare = new NativeShare();
    nativeShare.setShareData(shareConfig);
}

var share = function (command, pram) {
    try {
        if (pram) {
            nativeShare.setShareData({
                link: getfullLink(pram)
            });
        }

        nativeShare.call(command)
    } catch (err) {
        // 如果不支持，你可以在这里做降级处理
        nativeShare.call("default");
    }
}

var getfullLink = function (pram) {
    // var url = shareConfig.link+"&code="+pram.phoneAes;
    return shareConfig.link;
    // return url.replace("//","");
}

$(function () {
    //先检查是否存在code参数，如果有、组装二维码、注册相关分享事件


    var pramas = {code: getPram('code')};
    $.ajax(
        {
            url: getPhoneByAccount,
            type: 'post',
            dateType: 'json',
            headers: {'Content-Type': 'application/json;charset=utf8'},
            data: JSON.stringify(pramas),
            success: function (data) {
                if (data.code == 1) {
                    let phoneCode = data.msg;
                    phoneCodeData = data.msg
                    let pram = {
                        oldRouting: id_url + '/cn/mobile/rcfd_account?utm_source=company&utm_medium=Data%20contrast&utm_campaign=tuijian2-1&code=' + phoneCode,
                        meaning: 'A_' + phoneCode
                    };
                    if (pram.oldRouting == null || pram.oldRouting === "") {
                        return;
                    }
                    //得到手机号的加密串
                    $.post(getPhoneByAccountUrl, {oldRouting: pram.oldRouting, meaning: pram.meaning}, function (data) {

                        if (data.code == 0) {

                            //二维码
                            createImg(data.data);
                        }
                    });
                }
            },
        }
    );


    $.loadScript(img_url + "/source/public/js/clipboard.min.js", function () {
        var clipboard = new Clipboard('.bds_copy', {
            text: function () {
                return getfullLink(pram);
            }
        });

        clipboard.on('success', function (e) {
            alert("复制成功");
            e.clearSelection();
        });
    });

    //绑定按钮事件
    $(".bds_weixin").click(function () {
        share('wechatFriend', pram);
    });
    $(".bds_weixinp").click(function () {
        share('wechatTimeline', pram);
    });
    $(".bds_sqq").click(function () {
        share('qqFriend', pram);
    });
    $(".bds_qzone").click(function () {
        share('qZone', pram);
    });
    $(".bds_tsina").click(function () {
        share('weibo', pram);
    });

    // $(".bds_copy").click(function () {
    //     share('weibo',pram);
    // });
    $("#copy").click(function () {
        var url = getfullLink(pram);
        console.log(url);
        $("#copied").val(url);
        copyToClipboard(copy);
        $(".app-btn-copy").show();
    })
})


$.extend({
    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    share: function (title, content, url, imageUrl) {
        // alert("ios")
        if ($.mechined() == 1) {
            // alert(window.shareContent)
            if(typeof(window.shareContent) !== 'undefined'){
                window.shareContent(title, content, url, imageUrl);
            }else{
                // alert("新版方法")
                var string = {'title':title,'contnet':content,'url':url,'imgUrl':imageUrl}
               
                window.webkit.messageHandlers.shareContent.postMessage(string)
            }
           
        }//invokeIos("shareContent",param,callback);
        else {
            uiObject.shareContent(title, content, url, imageUrl);
        }
    },
    sharing: function () {
        var title = "我在创富炒汇多年 希望和您一起投资赚钱",
            content = "推荐好友享三重好礼",
            url = "https://m.cfd139.com.cn/cn/zt/campaign1802.html?utm_source=company&amp;utm_medium=Data%20contrast&amp;utm_campaign=tuijian2&code=" + phoneCodeData,
            imageUrl = "https://img.getfc.com.cn/source/material/app-logo.png";
        $.share(title, content, url, imageUrl);
    },
    jsInvokeAndroid: function (func) {
        eval("window.android." + func + "()");
    },
})



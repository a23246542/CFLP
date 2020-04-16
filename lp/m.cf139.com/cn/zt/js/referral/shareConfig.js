var getPram = function (name) {
    var search = window.location.search;
    var str = null;
    if(search.length>0){
        var arr = search.split("&");
        for(var i=0;i<arr.length;i++){
            var tmp = arr[i];
            if(tmp.indexOf(name)!=-1){
                str = tmp.substring(tmp.indexOf(name)+name.length+1);
            }
        }
    }
    if(str==null){
        str = $("#code").val();
    }
    return str;
}
var shareConfig = {
    title: '我在创富炒汇多年\n希望和您一起投资赚钱',
    desc: '推荐好友享三重好礼',
    // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
    link: 'https://m.cfd139.com.cn/cn/zt/campaign1802.html?utm_source=company&utm_medium=Data%20contrast&utm_campaign=tuijian2&code='+getPram("code"),
    qrCodeUrl:"https://ac.cfd139.com.cn/cn/mobile/rcfd_account?utm_source=company&utm_medium=Data%20contrast&utm_campaign=tuijian2-1",
    icon: 'https://m.cfd139.com.cn/cn/zt/images/rec-app/erweima-m.png',
    // 不要过于依赖以下两个回调，很多浏览器是不支持的
    success: function() {
        console.info('success');
    },
    fail: function() {
        console.error('fail');
    }
}
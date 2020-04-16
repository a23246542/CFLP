$(function(){
    var Terminal = {
        platform : function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                // android终端或者uc浏览器
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                // 是否为iPhone或者QQHD浏览器
                iPhone: u.indexOf('iPhone') > -1 ,
                // 是否iPad
                iPad: u.indexOf('iPad') > -1
            };
        }()
    }
    if(Terminal.platform.android){
        $('.m-footer a.item-1').attr("href","<!--#echo var='IMG_URL' default=''-->/source/material/CFD_APP.apk");
        $('.download').attr("href","<!--#echo var='IMG_URL' default=''-->/source/material/CFD_APP.apk");
    }else if(Terminal.platform.iPhone){
        $('.m-footer a.item-1').attr("href","https://itunes.apple.com/us/app/chuang-fucfd/id1153506842?mt=8");
        $('.download').attr("href","https://itunes.apple.com/us/app/chuang-fucfd/id1153506842?mt=8");
    }

})
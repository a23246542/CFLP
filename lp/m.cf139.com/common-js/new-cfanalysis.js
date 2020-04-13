
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-71703518-1', 'auto');
ga('send', 'pageview');


/**
 * UUID 生成算法
 * @constructor
 */
function UUID() {
    this.id = this.createUUID()
}
UUID.prototype.valueOf = function () {
    return this.id
};
UUID.prototype.toString = function () {
    return this.id
};
UUID.prototype.createUUID = function () {
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t, 0, 31);
    var tm = UUID.getIntegerBits(t, 32, 47);
    var thv = UUID.getIntegerBits(t, 48, 59) + '1';
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n
};
UUID.getIntegerBits = function (val, start, end) {
    var base16 = UUID.returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1))
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '')
            quadString += '0';
        else
            quadString += quadArray[i]
    }
    return quadString
};
UUID.returnBase = function (number, base) {
    return (number).toString(base).toUpperCase()
};
UUID.rand = function (max) {
    return Math.floor(Math.random() * (max + 1))
};

function setGWAnalysisParams(_maq){
    var params = {};
    //Document对象数据

    if(document) {
        //params.url = decodeURI(document.URL) || '';
        //params.pagetitle = document.title || '';
        params.prevUrl = decodeURI(document.referrer) || '';
    }
    /*
   //Window对象数据
   if(window && window.screen) {
       params.sh = window.screen.height || 0;
       params.sw = window.screen.width || 0;
       params.cd = window.screen.colorDepth || 0;
   }
   //navigator对象数据
   if(navigator) {
       params.lang = navigator.language || '';
   }
   */
    //解析_maq配置
    if(_maq) {
        for(var i in _maq) {
            switch(_maq[i][0]) {

                //公共字段
                case '_setlogType':
                    params.logType = _maq[i][1];
                    break;
                case '_setSessionId':
                    params.sessionId = _maq[i][1];
                    break;
                case '_setUserId':
                    params.userId = _maq[i][1];
                    break;
                case '_setPlatformVersion':
                    params.platformVersion = _maq[i][1];
                    break;
                case '_setPlatformType':
                    params.platformType = _maq[i][1];
                    break;
                case '_setPlatformName':
                    params.platformName = _maq[i][1];
                    break;
                case '_setBusinessPlatform':
                    params.businessPlatform = _maq[i][1];
                    break;
                case '_setDeviceId':
                    params.deviceId = _maq[i][1];
                    break;
                case '_setUtmctr':
                    params.utmctr = _maq[i][1];
                    break;
                case '_setUtmccn':
                    params.utmccn = _maq[i][1];
                    break;
                case '_setUtmcct':
                    params.utmcct = _maq[i][1];
                    break;
                case '_setUtmcmd':
                    params.utmcmd = _maq[i][1];
                    break;
                case '_setUtmcsr':
                    params.utmcsr = _maq[i][1];
                    break;
                case '_setUtmctr2':
                    params.utmctr2 = _maq[i][1];
                    break;
                case '_setUtmccn2':
                    params.utmccn2 = _maq[i][1];
                    break;
                case '_setUtmcct2':
                    params.utmcct2 = _maq[i][1];
                    break;
                case '_setUtmcmd2':
                    params.utmcmd2 = _maq[i][1];
                    break;
                case '_setUtmcsr2':
                    params.utmcsr2 = _maq[i][1];
                    break;
                case '_setUtmcsr2':
                    params.utmcsr2 = _maq[i][1];
                    break;
                case '_setEventCategory':
                    params.eventCategory = _maq[i][1];
                    break;
                case '_setEventAction':
                    params.eventAction = _maq[i][1];
                    break;
                case '_setEventLabel':
                    params.eventLabel = _maq[i][1];
                    break;
                case '_setEventValue':
                    params.eventValue = _maq[i][1];
                    break;

                //网站扩展字段
                case '_setMarkWords':
                    params.markWords = _maq[i][1];
                    break;
                case '_setBehaviorDetail':
                    params.behaviorDetail = _maq[i][1];
                    break;
                case '_setBehaviorType':
                    params.behaviorType = _maq[i][1];
                    break;
                case '_setAdvisoryType':
                    params.advisoryType = _maq[i][1];
                    break;
                /**case '_setPrevurl':
                 params.prevurl = _maq[i][1];
                 break;**/

                //直播间扩展字段
                case '_setUserSource':
                    params.userSource = _maq[i][1];
                    break;
                /**case '_setUseEquipment':
                 params.useEquipment = _maq[i][1];
                 break;**/
                case '_setAccountPlatform':
                    params.accountPlatform = _maq[i][1];
                    break;
                case '_setAccountType':
                    params.accountType = _maq[i][1];
                    break;
                case '_setTradingAccount':
                    params.tradingAccount = _maq[i][1];
                    break;
                case '_setRoomId':
                    params.roomId = _maq[i][1];
                    break;
                case '_setRoomName':
                    params.roomName = _maq[i][1];
                    break;
                case '_setVideoId':
                    params.videoId = _maq[i][1];
                    break;
                case '_setVideoName':
                    params.videoName = _maq[i][1];
                    break;
                case '_setCourseId':
                    params.courseId = _maq[i][1];
                    break;
                case '_setCourseName':
                    params.courseName = _maq[i][1];
                    break;
                case '_setTeacherId':
                    params.teacherId = _maq[i][1];
                    break;
                case '_setTeacherName':
                    params.teacherName = _maq[i][1];
                    break;
                case '_setOperateentrance':
                    params.operateEntrance = _maq[i][1];
                    break;
                case '_setUserType':
                    params.userType = _maq[i][1];
                    break;
                case '_setOperationType':
                    params.operationType = _maq[i][1];
                    break;
                case '_setUserTel':
                    params.userTel = _maq[i][1];
                    break;
                case '_setTouristId':
                    params.touristId = _maq[i][1];
                    break;
                case '_setUserName':
                    params.userName = _maq[i][1];
                    break;
                case '_setNickName':
                    params.nickName = _maq[i][1];
                    break;
                case '_setEmail':
                    params.email = _maq[i][1];
                    break;

                default:
                    break;
            }
        }
    }
    //拼接参数串
    var args = '';
    for(var i in params) {
        if(args != '') {
            args += '&';
        }
        args += i + '=' + encodeURIComponent(params[i]);
    }
    //通过Image对象请求后端脚本
    var img = new Image(0, 0);
    img.src = bi_url+'/1.gif?' + decodeURI(args) + '&dates=' + new Date().getTime()+ '&';
}
/*
 * 不同的浏览器跳转到不同的地址
 */
function gohtml()
{
    var url =window.location.pathname;
    if(isPc() && (url=="/" || url==""))
        window.location.href="/pc/real";
    else  window.location.href="/m/real";
}

String.prototype.startWith=function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
}

String.prototype.endWith=function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
}

function isPc()
{
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)
        return false;
    else   return true;
}

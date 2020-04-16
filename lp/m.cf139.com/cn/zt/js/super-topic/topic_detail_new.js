// 我也想说


 //app调用ios
 window.getInfoCallback = function (info) {
    $.getInfoIos(info);
};
var customerTel, customerNo,appCustomerNo;
$(".talkIn").click(function () {
    $("#area").attr("disabled",false)
    var id = $.getUrlParam('topicId');
    var customerNo = $.cookie("customerNo");
    var pram = window.location.search;
    if(pram.indexOf("noneheader=1") != -1 || pram.indexOf("noneHeader=1") != -1){
        //是app
        $.loadFromApp()
    }else{
        // 手机端
        if(!$.isLogin()){
            $("#loginKuang").show();
        }else{
            $(".fixed-popup").hide();
            $(".talk-popup").show();
            $("#area").val('');
            $(".left-count span").html("0");
        }
    }

});

// 输入留言
$("#area").keyup(function () {
    // console.log($(this).val());
    var areaValue = $(this).val();
    $.reduce($.getTextLength(areaValue));
});
//发送留言
$(".right-sub").click(function () {

    if (!$("#area").val()) {
        $(".talk-box .info").show().empty().html("留言不能为空哦！");
        setTimeout(function () {
            $(".talk-box .info").hide()
        }, 3000)
    } else {
        //发声成功
        var text = $("#area").val().slice(0,300);
        $.voitSuccess(text);
    }
});

$(".point-wrapper .overlay").click(function () {
    $('.point-wrapper').hide()
});
// app端点去产品详情页
$("#marketBox").on("click", " li a", function () {
    var prama = $(this).attr("url-data");
    // alert($.mechined())
    if ($.mechined() == 0) {
        // var str = prama.substring(28)
        uiObject.toProductChartPage(prama);
    } else {
        // alert("2")
        if (typeof(window.toProductChartPage) !== 'undefined') {
            // alert("3" +"旧版方法")
            window.toProductChartPage(prama)
           } else {
            //    alert("4" +"新版方法")
            window.webkit.messageHandlers.toProductChartPage.postMessage(prama)
           }
        // toProductChartPage(prama);
    }
});
$(function () {
    $.setEvent()
})


$.extend({
    setEvent(){

        $(".yes").click(function () {
            $(this).hide()
            $(this).prev().hide()
            $(this).nextAll().show()
        })
        $(".no").click(function () {
            $(this).hide()
            $(this).prevAll().show()
            $(this).next().hide()
        })
        $("#commentList  li").on("click",".commentLike",function () {
            var url = cms_url + "/api/jwt/topic/commentsLike";
            var id = $(this).attr("data-num");
            var cookieId = $.cookie("clicked_"+id);
            var status;
            if(cookieId == id){
                status = 0
            }else{
                status = 1
            }
            var options ={
                status : status,
                commentsId:id
            }
            $.getAjax(url,options,function (data) {
                if(data.code == 0 && data.msg =="成功"){
                    $.likeSucc(id,status);
                }
            })
        })
    },
    JsonpAjax: function (url, options, callbackSuc, callbackErr) {
        $.extend(options, {_r: Math.random()});
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            data: options,
            dataType: "jsonp",// 数据类型为jsonp
            jsonp: 'jsonpCallback',
            beforeSend: function () {
                $("#loading").html("<img src='https://m.cf139.com/static/img/jiazai.gif' />"); //在后台返回success之前显示loading图标
            },
            success: function (data) {
                //console.log(data);
                $("#loading").hide();
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                $("#loading").hide();
                console.log("请求失败，url :" + url);
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });

    },
    //通用ajax请求
    ajaxk: function (type, url, options, callbackSuc, callbackErr) {
        $.extend(options, {url: Math.random()});
        var stringOption = {
            apiKey: 'aa36cadb05d8afaa896487a920df255f7771b3983dbed00e6c1b6ee6ac04356b',
        }

        let newsStringOption = {...options,...stringOption}
        $.ajax({
            type: type,
            url: url,
            async: false,
            data: options,
            dataType: "json",// 数据类型为jsonp
            headers:{sign:hex_md5(this.objToKeyValue(newsStringOption))},
            success: function (data) {
                //console.log(data);
                if ($.isFunction(callbackSuc)) callbackSuc(data);
            },
            error: function (data) {
                console.log("请求失败，url :" + url);
                if ($.isFunction(callbackErr)) callbackErr(data);
            }
        });
    },
    postAjax: function (url, options, callbackSuc, callbackErr) {
        $.ajaxk("POST", url, options, callbackSuc, callbackErr);
    },
    getAjax: function (url,options, callbackSuc, callbackErr) {
        $.ajaxk("GET", url, options, callbackSuc, callbackErr);
    },
    getAppInfo(){
        appCustomerNo = $.getUrlParam('accountNo')
        $.getData("app");
    },
    getAppUserInfo(){
        var useInfo, type = $.mechined(),user;
        //如果是安卓手机浏览器且是配置的是APP内应用
        if (type == 0 && typeof (uiObject) !== "undefined") {
            useInfo = uiObject.getInfo();//android终端
            user = $.parseJSON(useInfo);
        } else if (type == 1){
        //    alert("ios")
            if (typeof(window.getInfo) !== "undefined") {
                useInfo = window.getInfo()
                if (typeof (useInfo) != "undefined") {
                    user = $.parseJSON(useInfo);
                }
               } else {
                //   alert("新版")
                window.webkit.messageHandlers.getInfo.postMessage("")
               }
        };//ios
        this.getCommonAppInfo(user)
    },
    getCommonAppInfo(user){
         //如果从APP获取到的信息不为空，则到后台进行存储
            // alert( "2" + user.account)
            if (user.account != undefined && user.account!=null &&  user.account!="") {
                //已经登录
                appCustomerNo = user.account;
            }else{
                // alert("未登陆")
                appCustomerNo = "";
            }
            this.getData("app")
      
    },
    //新版1.7.9 ios
    getInfoIos(info){
        // alert( "1" +info)
     this.getCommonAppInfo(info)
   },
    loadFromApp: function () {
        if(appCustomerNo){
            $(".fixed-popup").hide();
            $(".talk-popup").show();
            $("#area").val('');
            $(".left-count span").html("0");
        } else {       //未登录
            window.location.href ="intercept_login"
        }
    },
    /**
     * 对象key值排序
     * @param obj  格式:var obj  = {"flag":"reg","phone":"13632803616","apiKey":"send_sms_PYUauFIb"};
     * @returns
     */
    objToKeyValue:function(obj) {
        var arr = [];
        var str = [];
        for ( var name in obj) { //存下对象的key值
            arr.push(name);
        }
        arr.sort(); //对象key值排序

        for (var i = 0, j = arr.length; i < j; i++) { //拼接 key=value
            str.push(arr[i] + '=' + obj[arr[i]]);
        }

        return str.join('&'); //返回 key1=value1&key2=value2 ...
    },
    //获取cookie
    cookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },

    /**
     * 发言评论
     * @param text
     */
    voitSuccess: function (text) {
        var url = cms_url + "/api/jwt/topic/saveComments"
        var id = $.getUrlParam('topicId');
        var number;
        // alert(appCustomerNo)
        if(appCustomerNo != "" && appCustomerNo != undefined){
            number = appCustomerNo
        }else{
            number = $.cookie('customerNo')
        }
        var options = {
            customerNo: number,
            content: encodeURI(text),
            topicId: id
        };
        $.postAjax(url, options, function (data) {
            //console.log(data);
            if (data.code == 0) {
                $(".bg-voitsucc").show()
                $(".bg-voitsucc span").html("发表成功")
                $.getCommentList(1)
                setTimeout(function () {
                    $(".talk-popup").hide();
                    $(".fixed-popup").show();
                    $(".bg-voitsucc").hide();
                }, 1000);

            }else if(data.code == 1){
                $(".bg-voitsucc").show()
                $(".bg-voitsucc span").html(data.msg).show()
                setTimeout(function () {
                    $(".talk-popup").hide();
                    $(".fixed-popup").show();
                    $(".bg-voitsucc").hide();
                }, 1000);
            }
            $.setEvent()
        })
    },
    /**
     * 表示已经登录而且投过票了
     * @param text
     */
    votedAndLogin:function(id,num){
        // var url = "http://mis.cf860.com/public/topic/canComment?topicId="+id +"&customerNo="+num;
        var url = "https://mis.cf139.com/public/topic/canComment?topicId="+id +"&customerNo="+num + "&r="+Math.random();
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (res) {
                // alert(res)
                if (res.code == 200) {
                    //已经登录过 投过票了

                }else if(res.code ==500){
                    // alert(res)
                    $(".votedInfo").show()
                    setTimeout(function () {
                        $(".votedInfo").hide()
                    }, 3000)
                }
            }
        })
    },
    //登录
    login: function () {
        $("#loading").show();
        var mis_url = "https://mis.cf139.com";
        // var mis_url = "https://mis.cf139.com";
        var url = mis_url + "/cfd/fxlogin";
        var options = {
            /* customerNumber:"81015540",
             password:"ct170424",*/
            customerNumber: $("#phone").val(),
            password: $("#upwd").val(),
            platform: "GTS2",
            actId: "1"
        };
        $.JsonpAjax(url, options, function (data) {
            if (data.code == 200) {
                $.cookie("login", "success");
                $("#loginKuang").hide();
                customerTel = data.ch_msg.MOBILE_PHONE_NO;
                customerNo = data.ch_msg.customerNumber;
                // 将手机号码存进cookie里面，多次发www.cms139.com声
                $.cookie("customerTel", customerTel);
                $.cookie("customerNo", customerNo);
            } else {
                $(".error-info").show().html(data.ch_msg);
            }
        });
    },
    //是否登陆
    isLogin: function () {
        var cookieLogin = $.cookie('login');
        // console.log(cookieLogin);
        if (cookieLogin == null || cookieLogin == "") {
            //弹出登录框
            return false;
        }
        return true;
    },
    //获取字符长度
    getTextLength: function (text) {
        var length = 0;
        for (var i = 0; i < text.length; i++) {
            length++;
        }
        if (length >= 300) {
            length = 300
            $("#area").attr('disabled',"disabled");
        }
        return length;
    },

    //数字减少
    reduce: function (length) {
        $(".left-count span").html(length)
        if (length >= 300) {

            return;
        }


    },

    //获取url中的参数
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },
    //获取数据 开始 结束 正在进行
    getData: function (flag) {
        // alert("获取数据")
        // alert(appCustomerNo)
        var topicId = $.getUrlParam('topicId');
        var options;
        if(flag == "app"){
            if(appCustomerNo){
                options = {
                    topicId:topicId,
                    customerNo:appCustomerNo
                }
            }else{
                options = {
                    topicId:topicId,
                    customerNo:''
                }
            }

        }else{
            if($.cookie("customerNo")){
                options = {
                    topicId:topicId,
                    customerNo:$.cookie("customerNo")
                }
            }else{
                options = {
                    topicId:topicId,
                    customerNo:''
                }
            }

        }

        var url = cms_url + '/api/jwt/topic/topicDetail'
        this.getAjax(url,options,function (data) {
            if(data.code == 0 && data.msg =="成功"){
                $("#loadingTopic").hide()
                $.editAll(data);
                if (flag) {
                    $.editAll(data, flag);
                }
            }
        })
    },
    /**
     * 获取评论列表
     * @param pageNum
     */
    getCommentList:function(pageNum,flag){
        var url = cms_url + "/api/jwt/topic/pageByComment";
        var topicId = $.getUrlParam('topicId');
        var options = {
            topicId:topicId,
            length:10,
            draw:pageNum
        }
        this.getAjax(url,options,function (data) {
            if(data.code == 0 && data.msg =="成功"){
                // console.log(data)
                $.editCommentList(data,flag)
            }
        })
    },

    /**
     * 编辑评论
     * @param data
     */
    editCommentList:function(data,flag){
        var str = '';
        var top,side,obverse,accountNb,creatTime,ds,count,color ,voitedId,voitedOptype;
        var data = data.data;

        if(data){
            for(var i in data){

                if(data[i].remark.length > 100){
                    showAll = "yes"
                }else{
                    showAll = ""
                }
                //正方反方
                side = data[i].opType;
                if(side ==1){
                    obverse ="正方"
                    color="red"
                }else if( side == 2){
                    obverse ="反方"
                    color="blue"
                }else if( side == 0){
                    obverse ="中立"
                    color="grey"
                }
                //账号隐藏
                if(data[i].customerNo){
                    var number = String(data[i].customerNo);
                    accountNb = number.substr(0,2) +"****" +number.substring(6)
                }else{
                    accountNb ="81****29"
                }
                //时间格式转换
                creatTime = $.dateFormatFull(data[i].createdDate);
                //支持数
                count = data[i].supportCount;
                str += ["   <li>",
                    "                                <div class=\"item-1\">",
                    "                                    <div class=\"leftArea\">",
                    "                                        <div class=\"left "+ color +"\">"+ obverse +"</div>",
                    "                                        <div class=\"right\">",
                    "                                            <div class=\"leftNumber\">"+accountNb+"</div>",
                    "                                            <div class=\"leftTime\">"+ creatTime +"<i class=\"hot "+ ds +"\" >",
                    "                                                </i>",
                    "                                            </div>",
                    "                                        </div>",
                    "                                    </div>",
                    "                                    <div class=\"rightArea commentLike\" id='like_"+ data[i].commentsId+"' data-num = "+ data[i].commentsId +" >",
                    "                                        <i class=\"hot\"><img src=\"../images/super-topic/like01.png\" alt=\"\"></i>",
                    "                                        <span>"+ count +"</span>",
                    "                                    </div>",
                    "                                </div>",
                    "                                <div class=\"item-2\">",
                    "                                    "+ (data[i].remark).slice(0,100) +"",
                    "                                </div>",
                    "                                <div class=\"item-3 "+ showAll +"\">",
                    "                                    展开",
                    "                                        <span></span>",
                    "                                </div>",
                    "                                <div class=\"item-5 no\">",
                    "                                    收缩",
                    "                                <span></span>",
                    "                                </div>",
                    "                                <div class=\"item-4\">",
                    "                                    "+ (data[i].remark) +"",
                    "                                </div>",

                    "                            </li>"].join("");
            }
            if (data.length < 10) {
                $("#loadMoreComment").hide();
            } else {
                $("#loadMoreComment").show();
            }
            if(flag ==="more"){
                $("#commentList").append(str)
            }else{
                $("#commentList").empty().prepend(str)
            }

        }

    },
    /**
     * 加载更多评论列表
     * @param pageNo
     */
    getMoreComment:function(pageNo,flag){
        var pageNum = Number(pageNo)
        $("#loadMoreComment").click(function () {
            pageNum = pageNum + 1;
            $.getCommentList(pageNum,flag)
            $.setEvent()

        })

    },
    /**
     * 执行点赞方法
     */
    getLike:function(){
        // 点赞


    },
    /**
     * 点赞成功后执行
     * @param id
     */
    likeSucc:function(id,status){
        if(status == 1){
            $("#like_"+ id).find("img").attr("src","../images/super-topic/like02.png");
            var count =  Number($("#like_"+ id).find("span").html());
            $("#like_"+ id).find("span").html(count +1);
            $.cookie("cesghi",id)
            $.cookie('clicked_'+id,id)
        }else if(status == 0){
            $("#like_"+ id).find("img").attr("src","../images/super-topic/like01.png");
            var count =  Number($("#like_"+ id).find("span").html());
            $("#like_"+ id).find("span").html(count -1);
            $.cookie('clicked_'+id,"")
        }

    },
    getHeader(urls){
        if(urls){
            return '<img src="'+ urls[0].imgUrl+'"/><img src="'+ urls[1].imgUrl+'" /><img src="'+ urls[2].imgUrl+'" />'
        }else{
            return '<img src="" />'
        }

    },
    //编辑数据
    editAll: function (data, flag) {
        var imgUrl, topicTitle, stime, topicStract, topicDetail,  debate,headerUrl,commentTotal,totalPosts;
        var str = ''
        var data = data.data
        imgUrl = data.imgUrlDetail;
        topicTitle = data.title;
        stime = $.dateFormat(data.createTime);
        topicDetail = data.topicDetail
        topicStract= data.topicAbstract
        //评论人数
        commentTotal = data.totalPosts + data.commentCount
        //讨论人数
        totalPosts = data.supportCount +data.oppositionCount + data.topicUvCount
        if(commentTotal >999){
            commentTotal= "999+"
        }
        //用户头像
        headerUrl = data.headList;
        let header = this.getHeader(headerUrl) + totalPosts +"人正在参与讨论"
        //总评论数
        $("#commentTotal").empty().html(commentTotal)
        //详情顶部的图片
        $(".detail-img").empty().append("<img src=\"" + imgUrl + "\" alt=\"\">");
        //用户头像
        $(".header-box").empty().append(header)
        //标题
        $(".detail-title").empty().append(" <div class=\"news-title\">" + topicTitle + "</div>")
        //时间
        $(".header-time").empty().append(stime)
        //
        $(".detail-stract").empty().html(topicStract);
        $(".situ-content .situ-detail").empty().append(topicDetail);
        debate = $.editDebate(data,1);
        $(".compact").empty().append(debate);
        $.voitPoll();
        // 咨询列表展示
        var newsJson=data.newsJson;
        if (typeof (newsJson) == "undefined"||newsJson=="") {
            $(".news-wrapper").hide();
        } else {
            var newsData = JSON.parse(newsJson);
            $(".news-wrapper").show();
            $.newsData(newsData)
        }
        // app 端显示产品报价
        if(data.product !="" && data.product != undefined){
            // alert(data.product)
            marketP = data.product;
            $.editMarketBox(marketP)
        }else{
            marketP = ""
        }

    },
    /**
     * 辩论编辑
     * @param data
     * @param grey
     * @returns {string[]}
     */
    editDebate: function (data,type) {
        // console.log(data)
        var str = '',active01,active02,imgsrc01,imgsrc02;
        var pointTitle, supportIdea, opositeIdea, supportPoll, opositePoll,topicId;
        pointTitle = data.voteView;
        supportIdea = data.supportCopy;
        opositeIdea = data.oppositionCopy;
        supportPoll = data.supportCount ;
        opositePoll = data.oppositionCount;
        topicId = $.getUrlParam('topicId')
        if($.cookie("voitedId_"+topicId) == topicId ){
            //说明已经投过票了
            if($.cookie("opType_"+topicId) == 1){
                active01 ="active"
                imgsrc01 ="../images/super-topic/icon-red.jpg";
                imgsrc02="../images/super-topic/oppsit.png"
            }else if($.cookie("opType_"+topicId) == 2){
                active02 = "active"
                imgsrc02= "../images/super-topic/icon-blue.jpg";
                imgsrc01="../images/super-topic/support.png";
            }

        }else{
            if(type == 2){
                active02 ="";
                active01 ="";
                imgsrc01 ="../images/super-topic/icon-red.jpg";
                imgsrc02= "../images/super-topic/icon-blue.jpg"
            }else if(type == 1){
                active01 ="";
                active02 ="";
                imgsrc01="../images/super-topic/support.png";
                imgsrc02="../images/super-topic/oppsit.png"
            }
        }

        str=["<div class=\"compact-content\">",
            "                        <div class=\"viewpoint red "+ active01 +"\" data-type='support'>",
            "                            <div class=\"item-1\"><img src=\""+ imgsrc01+"\" alt=\"\"></div>",
            "                            <div class=\"item-2\"><div class='item-top'>"+supportIdea+"</div><div class='item-bottom'>赞成<i>"+supportPoll +"</i>票</div></div>",
            "                        </div>",
            "                        <div class=\"viewpoint blue "+ active02 +"\" data-type='oppose'>",
            "                            <div class=\"item-1\"><img src=\""+ imgsrc02 +"\" alt=\"\"></div>",
            "                            <div class=\"item-2\"><div class='item-top'>"+opositeIdea+"</div><div class='item-bottom'>不赞成<i>"+opositePoll +"</i>票</div></div>",
            "                        </div>",
            "                    </div>"].join("");
        return str;
    },

    /**
     * 按时间处理数据顺序
     * @param data
     */
    dealList: function (data) {
        var data = data.data;
        var  arr = [] ;
        for (var i in data) {
            if ( data[i].topicStatus == "3") {
                arr.push(data[i])
            }
        }
        arr = arr.slice(0, 4);
        // $("#detail-hff").empty().append($.editList(arr))

    },
    /**
     * 往期列表 编辑内容
     * @param data
     * @returns {string}
     */
    editList: function (data) {
        var html = '';
        var bgColor, staC, bgImg, url;
        for (var i in data) {
            // console.log(data[i])
            //状态中文字
            staC = $.status(data[i]).text;
            //图案
            label_url = $.status(data[i]).imgUrl;
            //得到跳转链接
            url = $.statusu(staC, data[i]);
            //  图片
            bgImg = data[i].imgUrlDetail;
            html +=
                [" <div class=\"swiper-slide\">",
                    "                   <a href=\"" + url + "\" class=\"item-1\">",
                    "                       <img src=\"" + bgImg + "\" alt=\"\">",
                    "                       <span class=\"future-label " + bgColor + "\"><img src='"+ label_url +"' alt=''>" + staC + "</span>",
                    "                   </a>",
                    "               </div>"].join("");
        }
        return html;
    },
    //投票
    voitPoll: function () {
        $(".viewpoint").click(function () {
            // 判断是否登陆
            var pram = window.location.search;
            // 调接口
            var id = $.getUrlParam('topicId');
            var point = $(this).attr("data-type");
            var opType;
            if (point == "support") {
                opType = 1
            } else if (point == "oppose") {
                opType = 2
            }     
            if(pram.indexOf("noneheader=1") != -1 || pram.indexOf("noneHeader=1") != -1){
                //是app
                // alert("1")

                if(appCustomerNo){
                    $.changeVoit(opType,id,appCustomerNo);
                } else {       //未登录
                    window.location.href ="intercept_login"
                    return
                }  


                // var useInfo, type = $.mechined();
                // //如果是安卓手机浏览器且是配置的是APP内应用
                // if (type == 0 && typeof (uiObject) !== "undefined") {
                //     useInfo = uiObject.getInfo();//android终端
                // } else if (type == 1) useInfo = getInfo();//ios
                // // alert(useInfo)
                // // alert(JSON.parse(useInfo))
                // //如果从APP获取到的信息不为空，则到后台进行存储
                // var user = $.parseJSON(useInfo);
                // if(user.account == ""){
                //     //未登录
                //     window.location.href ="https://admin.cfdealer88.com?intercept_deposit"
                //     return;
                // }else{
                //     $.changeVoit(opType,id,user.account);
                // }
            }else  if (!$.isLogin()) {
                $("#loginKuang").show();
                return;
            }else{
                $.changeVoit(opType,id);
            }





        });
    },
    getStatus: function (length, draw) {
        var url = cms_url + "/api/jwt/topic/topicList"
        var options = {
            length: length,
            draw: draw
        };
        $.getAjax(url, options, function (data) {
            if(data.code == "0"){
                $.dealList(data);
            }


        });
    },
    talkPopup:function(){
        $(".fixed-popup").hide()
        $(".talk-popup").show();
        $("#area").val('');
        $(".left-count span").html("0");
        $(".talk-box .info").hide();
    },
    changeVoit: function (opType,id,accountNo) {
        var url = cms_url + "/api/jwt/topic/topicVote"
        var customerNo;
        if(accountNo != "" && accountNo != undefined){
            customerNo = accountNo
        }else{
            customerNo = $.cookie("customerNo");
        }

        var options = {
            customerNo: customerNo,
            opType: opType,
            topicId: id
        };
        $.postAjax(url, options, function (data) {
            //console.log(data);
            if(data.code == 0 ){
                // 未投过票 投票成功 改变样式
                $.changeImg(opType)
                $.cookie("voitedId_"+id,id)
                $.cookie("opType_"+id,opType)
            }else if(data.code == 1){
                $(".voited-popup").show();
                setTimeout(function () {
                    $(".voited-popup").hide()
                }, 1000);
            }
        })
    },
    changeImg:function(opType){
        if(opType == 1){
            var count = Number($(".red").find('i').html());
            $(".red").find('i').html(count + 1);
            $(".red").addClass("active").siblings().removeClass("active");
            $(".red").find("img").attr("src","/cn/zt/images/super-topic/icon-red.jpg");
            $(".blue").find("img").attr("src","/cn/zt/images/super-topic/oppsit.png");
        }else if(opType == 2){
            var count = Number($(".blue").find('i').html());
            $(".blue").find('i').html(count + 1);
            $(".blue").addClass("active").siblings().removeClass("active");
            $(".blue").find("img").attr("src","/cn/zt/images/super-topic/icon-blue.jpg");
            $(".red").find("img").attr("src","/cn/zt/images/super-topic/support.png");
        }
    },
    /**
     * 编辑 App端显示产品
     * @param product
     */
    editMarketBox: function (product) {
        var newProduct = product.replace(/#/g,",")
        $.ajax({
            type: 'GET',
            url: "https://mis.cf139.com/public/marketprice/cfBySymbol?symbol=" + newProduct +"&r="+Math.random(),
            // url :  "http://mis.cf860.com/public/marketprice/cfBySymbol?symbol=" + newProduct,
            dataType: 'json',
            success: function (res) {
                var str = '';
                var ampClass,amplitude;
                if (res != null) {
                    var productInter = newProduct.split(",");

                    // console.log(productInter)
                    for (var i in res) {
                        if(res[i].amplitude){
                            ampValue = $.percent(res[i].amplitude);
                            ampClass = res[i].amplitude > 0 ? "#4ac158" : "#fb605a";
                        }else if(res[i].amplitude == 0){
                            ampValue = 0
                            ampClass =""
                        }

                        var url = productInter[i];
                        str+=[" <li>",
                            "                    <a url-data='" + url + "' href=\"javascript:void(0)\">",
                            "                        <div class=\"market-name\"><em>" + res[i].name + "</em></div>",
                            "                        <div class=\"market-value\"><span style='color: " + ampClass + "'>" + res[i].price + "</span><i style='color: " + ampClass + "'>"+ ampValue +"</i></div>",
                            "                    </a>",
                            "                </li>"].join("");
                    }
                    $("#marketBox").empty().append(str)
                }
            }
        })
    },
    percent:function(value){
        if(!value) return '';
        value = Number(value*100).toFixed(2);
        value+="%";
        return value;
    },
    /**
     * 判断设备 处理app产品跳转详情页面
     * @returns {number}
     */
    mechined: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) return 0;
        if (isiOS) return 1;
        else return -1;
    },
    /**
     * 咨询数据
     * @param data
     */
    newsData: function (data) {
        var str = '';
        for (var i in data) {
            str += ["  <li><a href=\" " + data[i].url + "\" target='_blank'><span>" + data[i].title + "</span> >>> </a></li>"].join("");
        }
        $("#newsList").empty().append(str)
    },




});
/**
 * 定时刷新接口
 */
var timer = setInterval(function () {
    if(marketP == "" || marketP == undefined){
        window.clearInterval(timer)
        return
    }
    $.editMarketBox(marketP)

}, 30000)




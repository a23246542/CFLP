// 我也想说

var customerTel, customerNo,appCustomerNo;
$(".talkIn").click(function () {
    var id = $.getUrlParam('topicId');
    var customerNo = $.cookie("customerNo");
    var pram = window.location.search;
    if(pram.indexOf("noneheader=1") != -1 || pram.indexOf("noneHeader=1") != -1){
        //是app
        // alert("1")
        $.loadFromApp(id)
    }else{
        // 手机端
        if($.isLogin()){
            $.votedAndLogin(id,customerNo)
        }else{
            $("#loginKuang").show();
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
        var text = $("#area").val();
        $.voitSuccess(text);
    }
});

$(".point-wrapper .overlay").click(function () {
    $('.point-wrapper').hide()
});
// app端点去产品详情页
$("#marketBox").on("click", " li a", function () {
    var prama = $(this).attr("url-data");
    if ($.mechined() == 0) {
        // var str = prama.substring(28)
        uiObject.toProductChartPage(prama);
    } else {
        toProductChartPage(prama);
    }
});


$.extend({
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
        $.ajax({
            type: type,
            url: url,
            async: false,
            data: options,
            dataType: "json",// 数据类型为jsonp
            //jsonp:'jsonpCallback',
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
        $.extend(options, {url: Math.random()});
        $.ajaxk("POST", url, options, callbackSuc, callbackErr);
    },
    getAjax: function (url, callbackSuc, callbackErr) {
        $.extend(options, {url: Math.random()});
        $.ajaxk("GET", url, "", callbackSuc, callbackErr);
    },
    loadFromApp: function (id) {
        var useInfo, type = $.mechined();
        //如果是安卓手机浏览器且是配置的是APP内应用
        if (type == 0 && typeof (uiObject) !== "undefined") {
            useInfo = uiObject.getInfo();//android终端
        } else if (type == 1) useInfo = getInfo();//ios
        // alert(useInfo)
        //如果从APP获取到的信息不为空，则到后台进行存储
        if (typeof (useInfo) != "undefined") {
            var user = $.parseJSON(useInfo);
            if (typeof (user.account) != "undefined" && (user.account!=null  && user.account!="")) {
                //已经登录
                // alert("2")
                appCustomerNo = user.account;
                $.votedAndLogin(id,appCustomerNo)
            } else {
                //未登录
                window.location.href ="https://admin.cfdealer88.com?intercept_deposit"
            }
        }
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

        // var url = "http://mis.cf860.com/public/topic/topicAnswer";
        var url = "https://mis.cf139.com/public/topic/topicAnswer";
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
            remark: text,
            topicId: id
        };
        $.postAjax(url, options, function (data) {
            //console.log(data);
            if (data.code == 200) {
                var text = data.msg;
                $(".talk-box .info").show().empty().html(text);
                setTimeout(function () {
                    $(".talk-popup").hide();
                    $(".fixed-popup").show();
                }, 1000);

            }
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
                    $(".fixed-popup").hide();
                    $(".talk-popup").show();
                    $("#area").val('');
                    $(".left-count span").html("0");
                    $(".talk-box .info").hide();
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
        // var mis_url = "http://mis.cf860.com";
        var mis_url = "https://mis.cf139.com";
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
                // 将手机号码存进cookie里面，多次发声
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
        return length;
    },
    //数字减少
    reduce: function (length) {
        if (length > 80) {
            $("#area").attr("disabled", "disabled")
            return;
        }
        $(".left-count span").html(length)
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
        $.ajax({
            type: 'GET',
            url :  "https://mis.cf139.com/public/topic/topicPageList",
            // url: "http://mis.cf860.com/public/topic/topicPageList",
            dataType: 'json',
            success: function (res, status) {
                if (status == "success") {
                    $.editAll(res);
                    $.detailList(res);
                    if (flag) {
                        $.editAll(res, flag);
                    }
                }
            }
        })
    },
    /**
     * 获取评论列表
     * @param pageNum
     */
    getCommentList:function(pageNum){
        var topicId = $.getUrlParam('topicId');
        // var url = "http://mis.cf860.com/public/topic/pageByComment?topicId="+topicId +"&draw="+pageNum+"&length=5";
        var url = "https://mis.cf139.com/public/topic/pageByComment?topicId="+topicId +"&draw="+pageNum+"&length=5&r="+Math.random();

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (res) {
                if (res.code == 200) {
                    console.log(res.ch_msg)
                    var data = res.ch_msg
                    $.editCommentList(data)
                }
            }
        })
    },
    /**
     * 编辑评论
     * @param data
     */
    editCommentList:function(data){
        var str = '';
        var top,side,obverse,accountNb,creatTime,ds,count,color ;
        if(data){
            for(var i in data){
                //置顶
                top = data[i].seq;
                if(top && top == 1){
                    ds = "ds"
                }else{
                    ds ="dn"
                }
                //正方反方
                side = data[i].opType;
                if(side && side ==1){
                    obverse ="正方"
                    color="red"
                }else if(side && side == 2){
                    obverse ="反方"
                    color="blue"
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
                    "                                                <img src=\"../images/super-topic/hot.png\" alt=\"\"></i>",
                    "                                            </div>",
                    "                                        </div>",
                    "                                    </div>",
                    "                                    <div class=\"rightArea commentLike\" id='like_"+ data[i].id+"' data-num = "+ data[i].id +" >",
                    "                                        <i class=\"hot\"><img src=\"../images/super-topic/like01.png\" alt=\"\"></i>",
                    "                                        <span>"+ count +"</span>",
                    "                                    </div>",
                    "                                </div>",
                    "                                <div class=\"item-2\">",
                    "                                    "+ data[i].remark +"",
                    "                                </div>",
                    "<div class=\"commentPopup popup_"+ data[i].id+"\">",
                    "您已经对该热评点赞！",
                    "</div>",
                    "                            </li>"].join("");
            }
            if (data.length < 5) {
                $("#loadMoreComment").hide();
            } else {
                $("#loadMoreComment").show();
            }
            $("#commentList").append(str)
        }

        //执行点赞方法
        $.getLike();

    },
    /**
     * 加载更多评论列表
     * @param pageNo
     */
    getMoreComment:function(pageNo){
        var pageNum = Number(pageNo)
        $("#loadMoreComment").click(function () {
            pageNum = pageNum + 1;
            $.getCommentList(pageNum)
        })

    },
    /**
     * 执行点赞方法
     */
    getLike:function(){
        // 点赞
        $("#commentList  li").on("click",".commentLike",function () {
            var id = $(this).attr("data-num");
            var cookieId = $.cookie("clicked_"+id);
            if(cookieId == id){
                $(".popup_"+id).show();
                setTimeout(function () {
                    $(".popup_"+id).hide();
                }, 1000);
            }else{
                $.ajax({
                    type: 'GET',
                    url :  "https://mis.cf139.com//public/topic/addSupportCount?commentId=" +id + "&r="+Math.random(),
                    // url: "http://mis.cf860.com//public/topic/addSupportCount?commentId=" +id,
                    dataType: 'json',
                    success: function (res, status) {
                        if (res.code == 200) {
                            // 点赞成功
                            $.likeSucc(id);
                        }
                    }
                })
            }
        })

    },
    /**
     * 点赞成功后执行
     * @param id
     */
    likeSucc:function(id){
        $("#like_"+ id).find("img").attr("src","../images/super-topic/like02.png");
        var count =  Number($("#like_"+ id).find("span").html());
        $("#like_"+ id).find("span").html(count +1);
        $.cookie('clicked_'+id,id)
    },
    //编辑数据
    editAll: function (data, flag) {
        var imgUrl, topicTitle, stime, topicStract, topicDetail,  debate;
        var str = '';
        //接收URL中的参数booksId
        var id = $.getUrlParam('topicId');
        var data = data.data;
        for (var i in data) {
            if (id == data[i].id) {
                imgUrl = data[i].imgUrl;
                topicTitle = data[i].title;
                stime = $.dateFormat(data[i].startTime);
                topicStract = data[i].topicAbstract;
                topicDetail = data[i].topicDetail
                //详情顶部的图片
                $(".detail-img").empty().append("<img src=\"" + imgUrl + "\" alt=\"\">");
                //标题
                $(".detail-title").empty().append(" <div class=\"news-title\">" + topicTitle + "</div> <div class=\"news-time\">" + stime + "</div>")
                // 收缩框里面的内容
                $(".open-title").empty().html(topicStract);
                $(".situ-content .situ-detail").empty().append(topicDetail);
                debate = $.editDebate(data[i],1);
                $(".compact").empty().append(debate);
                $.voitPoll();
                // 咨询列表展示
                var newsJson=data[i].newsJson;
                if (typeof (newsJson) == "undefined"||newsJson=="") {
                    $(".news-wrapper").hide();
                } else {
                    var newsData = JSON.parse(newsJson);
                    $(".news-wrapper").show();
                    $.newsData(newsData)
                }
                // app 端显示产品报价
                if(data[i].product !=""){
                    marketP = data[i].product;
                    $.editMarketBox(marketP)
                }else{
                    marketP = ""
                }


            }
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
        var pointTitle, supportIdea, opositeIdea, supportPoll, opositePoll;
        pointTitle = data.voteView;
        supportIdea = data.supportCopy;
        opositeIdea = data.oppositionCopy;
        supportPoll = data.supportCount + data.supportCountReal;
        opositePoll = data.oppositionCount + data.oppositionCountReal;
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
        str=["<div class=\"compact-content\">",
            "                        <div class=\"viewpoint red "+ active01 +"\" data-type='support'>",
            "                            <div class=\"item-1\"><img src=\""+ imgsrc01+"\" alt=\"\">赞成 <i>"+supportPoll+"</i>票</div>",
            "                            <div class=\"item-2\">"+supportIdea+"</div>",
            "                        </div>",
            "                        <div class=\"viewpoint blue "+ active02 +"\" data-type='oppose'>",
            "                            <div class=\"item-1\"><img src=\""+ imgsrc02 +"\" alt=\"\">不赞成 <i>"+opositePoll+"</i>票</div>",
            "                            <div class=\"item-2\">"+opositeIdea+"</div>",
            "                        </div>",
            "                    </div>"].join("");
        return str;
    },

    /**
     * 按时间处理数据顺序
     * @param data
     */
    detailList: function (data) {
        var data = data.data;
        //根据对象的startTime字段进行排序
        data.sort(function (a, b) {
            return b.startTime - a.startTime;
        });
        var arr = [];
        var now = new Date().getTime();
        for (var i in data) {
            if (now > data[i].endTime) {
                // console.log(data[i]);
                arr.push(data[i])
            }
        }
        arr = arr.slice(0, 4);
        $("#detail-hff").empty().append($.editList(arr))

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
            staC = $.status(data[i]);
            //状态英文color
            bgColor = $.statuss(staC);
            //得到跳转链接
            url = $.statusu(staC, data[i]);
            //  图片
            bgImg = data[i].imgUrl;
            html +=
                [" <div class=\"swiper-slide\">",
                    "                   <a href=\"" + url + "\" class=\"item-1\">",
                    "                       <img src=\"" + bgImg + "\" alt=\"\">",
                    "                       <span class=\"future-label " + bgColor + "\">" + staC + "</span>",
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
                var useInfo, type = $.mechined();
                //如果是安卓手机浏览器且是配置的是APP内应用
                if (type == 0 && typeof (uiObject) !== "undefined") {
                    useInfo = uiObject.getInfo();//android终端
                } else if (type == 1) useInfo = getInfo();//ios
                // alert(useInfo)
                // alert(JSON.parse(useInfo))
                //如果从APP获取到的信息不为空，则到后台进行存储
                var user = $.parseJSON(useInfo);
                if(user.account == ""){
                    //未登录
                    window.location.href ="https://admin.cfdealer88.com?intercept_deposit"
                    return;
                }else{
                    $.changeVoit(opType,id,user.account);
                }
            }else  if (!$.isLogin()) {
                $("#loginKuang").show();
                return;
            }else{
                $.changeVoit(opType,id);
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
        // var url = "http://mis.cf860.com/public/topic/topicAnswer";
        var url = "https://mis.cf139.com/public/topic/topicAnswer";
        var customerNo;
        if(accountNo != ""){
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
            if (data.code == 500) {
                // 已经投过票
                // 出弹窗
                $(".voited-popup").show();
                setTimeout(function () {
                    $(".voited-popup").hide()
                }, 1000);

            }else if(data.code == 200 ){
                // 未投过票 投票成功 改变样式
                $.changeImg(opType)
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
                            "                        <div class=\"market-name\"><em>" + res[i].name + "</em><span>" + res[i].symbol + "</span></div>",
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
            str += ["  <li><a href=\" " + data[i].url + "\" target='_blank'><span>" + data[i].title + "</span></a></li>"].join("");
        }
        $("#newsList").empty().append(str)
    },



});
/**
 * 定时刷新接口
 */
var timer = setInterval(function () {
    if(marketP == ""){
        window.clearInterval(timer)
        return
    }
    $.editMarketBox(marketP)

}, 30000)




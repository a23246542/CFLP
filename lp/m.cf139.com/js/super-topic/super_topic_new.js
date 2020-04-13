$(".topic-furture ").on("click", ".layout-content", function () {
    $(this).find(".future-popup").show();
    setTimeout(function () {
        $(".future-popup").hide()
    }, 2000)
});


$.extend({
    //通用ajax请求
    ajaxk: function (type, url, options, callbackSuc, callbackErr) {
        $.extend(options, {
            r: Math.random()
        });
        var stringOption = {
            apiKey: 'aa36cadb05d8afaa896487a920df255f7771b3983dbed00e6c1b6ee6ac04356b',
        }
        let newsStringOption = {...options,...stringOption}
        $.ajax({
            type: type,
            url: url,
            async: false,
            data: options,
            dataType: "json", // 数据类型为jsonp
            //jsonp:'jsonpCallback',
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
        $.extend(options, {
            url: Math.random()
        });
        $.ajaxk("POST", url, options, callbackSuc, callbackErr);
    },
    getAjax: function (url,options, callbackSuc, callbackErr) {
        $.ajaxk("GET", url, options, callbackSuc, callbackErr);
    },
    // 获取数据 开始 结束 正在进行
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
    //按时间处理顺序
    dealList: function (data) {
        var data = data.data;
        if (data.length < 10) {
            $(".load-more").hide();
        } else {
            $(".load-more").show();
        }
        for (var i in data) {
            if ( data[i].topicStatus == "3") {
                $(".topic-end").append($.editList(data[i]))
            } else if (data[i].topicStatus == "2") {
                $(".topic-furture").append($.editList(data[i]));
            } else if(data[i].topicStatus == "1"){
                $(".topic-ing").append($.editList(data[i]))
            }
        }

    },
    appendPopup: function (futureTime) {
        var html = '';
        html = ["<div class=\"future-popup\">别这么猴急，<span>" + futureTime + "</span>见</div>"].join("");
        return html;
    },


    // 编辑内容
    editList: function (data) {
        var html = '';
        var hideFlag = "none";
        var bgColor, staC, bgImg, url, realUrl,headerUrl,label_url;
        //状态中文字
        staC = $.status(data).text;
        //图案
        label_url = $.status(data).imgUrl;
        //状态英文color
        // bgColor = $.statuss(staC);
        //得到跳转链接
        url = $.statusu(staC, data);
        realUrl = "window.location.href='" + url + "'";
        //  图片
        bgImg = data.imgUrlListDetail;
        //用户头像
        headerUrl = data.headList;
        let header = this.getHeader(headerUrl)
        var stime = $.dateFormat(data.createTime);
        var sstime = $.dateFormat(data.startTime);
        var total = data.supportCount +data.oppositionCount + data.topicUvCount
        var commentTotal = data.totalPosts + data.commentCount
        html += [

            "<a href='javascript:void(0)' class=\"layout-content\">",
            "        <div class=\"item-2\">",
            "           <div class=\"news-title\">" + data.title + "</div>",
            "        </div>",
            "       <div class=\"item-1\"  onclick= " + realUrl + " style='background: url(" + bgImg + "); background-size: 6.9rem 3.8rem;'>",
            "          <div class=\"status\">",
            "              <div class=\" label " + bgColor + "\"><img src='"+ label_url +"' alt=''>" + staC + "</div>",
            "          </div>",
            "          <div class=\"count\">",
            "             <div class=\"count-content\">评论数: <span>" + commentTotal + "</span></div>",
            "          </div>",
            "        </div>",
            "        <div class=\"item-3\">",
            "           <div class=\"news-title\">" + header + "<span>" + total + "</span>人正在参与讨论</div>",
            "           <div class=\"news-time\">" + stime + "</div>",
            "        </div>",
            "       <div class=\"future-popup\" >别这么猴急，<span>" + sstime + "</span>见</div>",
            "     </a>"].join("");
        return html;
    },
    loadMore: function (pageNo) {
        $(".load-more").click(function () {
            pageNo = pageNo + 1;
            $.getStatus(10, pageNo)
        })
    },
    getHeader(urls){
        if(urls){
            return '<img src="'+ urls[0].imgUrl+'"/><img src="'+ urls[1].imgUrl+'" /><img src="'+ urls[2].imgUrl+'" />'
        }else{
            return '<img src="" />'
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
    }

});
$(".topic-furture ").on("click",".layout-content",function () {
    $(this).find(".future-popup").show();
    setTimeout(function () {
        $(".future-popup").hide()
    },500)
});



$.extend({
    JsonpAjax: function (url, options, callbackSuc, callbackErr) {
        $.extend(options, {
            _r: Math.random()
        });
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            data: options,
            dataType: "json", // 数据类型为jsonp
            // jsonp:'jsonpCallback',
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
            dataType: "json", // 数据类型为jsonp
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
        $.extend(options, {
            url: Math.random()
        });
        $.ajaxk("POST", url, options, callbackSuc, callbackErr);
    },
    getAjax: function (url, callbackSuc, callbackErr) {
        $.extend(options, {
            url: Math.random()
        });
        $.ajaxk("GET", url, "", callbackSuc, callbackErr);
    },
    // 获取数据 开始 结束 正在进行
    getStatus: function (length, draw) {
        var url = "https://mis.cf139.com/public/topic/topicPageList";
        // var url = "http://mis.cf860.com/public/topic/topicPageList";
        var options = {
            length: length,
            draw: draw
        };
        $.JsonpAjax(url, options, function (data) {
            // console.log(data);
            $.dealList(data);

        });
    },
    //按时间处理顺序
    dealList: function (data) {
        var data = data.data;
        var now = new Date().getTime();
        //根据对象的startTime字段进行排序
        data.sort(function(a,b){
            return   b.startTime -a.startTime;
        });
        // console.log(data);
        if(data.length<10){
            $(".load-more").hide();
        }else{
            $(".load-more").show();
        }
        for (var i in data) {
            if (now > data[i].endTime) {
                // console.log(data[i]);
                $(".topic-end").append($.editList(data[i]))
            } else if (now < data[i].startTime) {
                // console.log(data[i])
                $(".topic-furture").append($.editList(data[i]));
            } else {
                $(".topic-ing").append($.editList(data[i]))
            }
        }

    },

    appendPopup:function (futureTime) {
        var html ='';
        html =["<div class=\"future-popup\">别这么猴急，<span>"+futureTime+"</span>见</div>"].join("");
        return html;
    },


    // 编辑内容
    editList: function (data) {
        var html = '';
        var hideFlag ="none";
        var bgColor, staC, bgImg, url, realUrl;
        //状态中文字
        staC = $.status(data);
        //状态英文color
        bgColor = $.statuss(staC);
        //得到跳转链接
        url = $.statusu(staC, data);
        realUrl = "window.location.href='" + url + "'";
        //  图片
        bgImg = data.imgUrlDetail;
        var stime = $.dateFormat(data.startTime);
        var total = parseInt(data.supportCount) + parseInt(data.oppositionCount);
        html += ["<a href='javascript:void(0)'  class=\"layout-content\">",
            "                        <div class=\"item-1\"  onclick= " + realUrl + " style='background: url(" +
            bgImg + ")  ; background-size: 490px 270px;'>",
            "                            <div class=\"status \">",
            "                                <div class=\" label " + bgColor + "\">" + staC + "</div>",
            "                            </div>",
            "                            <div class=\"count\">",
            "                                <div class=\"count-content\">帖子数: <span>" + data.totalPosts +
            "</span>    参与人: <span>" + total + "</span></div>",
            "                            </div>",
            "                        </div>",
            "                        <div class=\"item-2\">",
            "                            <div class=\"news-title\">" + data.title + "</div>",
            "                            <div class=\"news-time\">" + stime + "</div>",
            "                        </div>",
            "<div class=\"future-popup\" >别这么猴急，<span>"+stime+"</span>见</div>",
            "                    </a>"].join("");
        return html;
    },
    loadMore: function (pageNo) {
        $(".load-more").click(function () {
            pageNo = pageNo + 1;
            $.getStatus(10, pageNo)
        })
    }

});
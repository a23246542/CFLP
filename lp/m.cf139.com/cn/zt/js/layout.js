var news_index = 0;
var news_go;
$(function () {
    news_change(0);
    news_go = setInterval(
        function () {
            news_btn(1)
        }, 3000);
});

function news_change(show_index) {
    $("#news_ul li").removeClass();
    var li_length = $("#news_ul li").length;
    var show_val = [show_index, show_index + 1, show_index + 2, show_index - 1, show_index - 2];
    $.each(show_val, function (i, this_val) {
        if (this_val >= li_length) {
            show_val[i] = this_val - li_length;
        }
        if (this_val < 0) {
            show_val[i] = li_length + this_val;
        }
    });
    $("#news_ul li:eq(" + show_val[0] + ")").addClass("show1");
    $("#news_ul li:eq(" + show_val[1] + ")").addClass("show2");
    $("#news_ul li:eq(" + show_val[2] + ")").addClass("show3");
    $("#news_ul li:eq(" + show_val[3] + ")").addClass("hide2");
    $("#news_ul li:eq(" + show_val[4] + ")").addClass("hide3");
    /*var news_btn = "";
    for (i = 0; i < li_length; i++) {
        if (i == show_index) {
            news_btn += "<span class='selected' onClick='news_page_change(" + i + ")'></span>";
        }
        else {
            news_btn += "<span onClick='news_page_change(" + i + ")'></span>";
        }
    }
    $("#news_btn").html(news_btn);*/
    var mobile_btn = "";
    var up_btn = show_index - 1;
    var down_btn = show_index + 1;
    if (up_btn < 0) {
        up_btn = li_length - 1;
    }
    if (up_btn >= li_length) {
        up_btn = 0;
    }
    if (down_btn < 0) {
        down_btn = li_length - 1;
    }
    if (down_btn >= li_length) {
        down_btn = 0;
    }
    mobile_btn += "<span class='top' onClick='news_page_change(" + up_btn + ")' ></span>";
    mobile_btn += "<span class='bottom' onClick='news_page_change(" + down_btn + ")'></span>";
    $("#new_mobile_btn").html(mobile_btn);
}

function news_page_change(page_id) {
    clearInterval(news_go);
    news_index = page_id;
    news_change(news_index);
    news_go = setInterval(
        function () {
            news_btn(1)
        }, 3000);
}

function news_btn(change_type) {
    var li_length = $("#news_ul li").length - 1;
    news_index = news_index + change_type;
    if (news_index < 0) {
        news_index = li_length;
    }
    if (news_index > li_length) {
        news_index = 0;
    }
    news_change(news_index);
}













    //复制链接功能

    function copyToClipboard(elem) {
// create hidden text element, if it doesn't already exist
        var targetId = "copied";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
// can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
// must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
// select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
// copy the selection
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch(e) {
            succeed = false;
        }
// restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        if (isInput) {
// restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
// clear temporary content
            target.textContent = "";
        }
        return succeed;
    }

    //手机端
    var layer=document.createElement("div");
    layer.id="layer";
    function funcm()
    {
        var style=
        {
            position:"absolute",
            zIndex:10,
            width:"1.5rem",
            height:"0.2rem",
            right:"2.5rem",
            top:"3.8rem",
            fontSize:"0.26rem",
            color:"#666"
        };
        for(var i in style)
            layer.style[i]=style[i];
        if(document.getElementById("layer")==null)
        {
            document.body.appendChild(layer);
            layer.innerHTML="复制成功"
            setTimeout("document.body.removeChild(layer)",2000)
        }
    }

    $(function(){
        var tabNum=$(".important").find("li");
        var contentNum=$(".contents").children();
        $(tabNum).each(function(index){
            $(this).click(function(){
                var that=$(this);
                $(contentNum).eq(index).css({"display":"block"});
                $(contentNum).eq(index).siblings().css({"display":"none"});
                that.find("a").css({"background":"#FFF","color":"#fff"});
                that.find("strong").show();
                that.find("em").show();
                that.find("p").css({"color":"#035a82"});
                that.find("div").css({"background":"#e1f5ff","border":"none"});
                that.siblings().find("strong").hide();
                that.siblings().find("em").hide();
                that.siblings().find("p").css({"color":"#333"});
                that.siblings().find("div").css({"background":"none","border":"1px solid #ccc"});

            });

        });


        //绑定增加手机号按钮事件
        $('#friend_share_addphone').on('click', function(){
            if($('.message-input-list  li').length >= 10){
                $("#ym-window").show();
                return;
            }

            $("#friend_share_addphone").css("right","-33px");

            if($('#friend_share_phones li').length%2 == 0){
                $('#friend_share_phones').append('<li><input type="text" placeholder="请输入手机号码"></input></li>');
            }else{
                $('#friend_share_phones').append('<li><input type="text" class="second" placeholder="请输入手机号码"></input></li>');
            }

        })
    });
    //活动详情切换
    $('.m-rule .layout-1').click(function(){
        $('.m-rule .layout-1 i').toggleClass('active');
        $('.m-rule .layout-2').toggle()
    });




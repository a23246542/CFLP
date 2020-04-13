function  hrefParam(key) {
    value="";
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) value= unescape(r[2]);
    return value;
}


function menu()
{
    var html="";
    if(hrefParam("app")!="" || hrefParam("special")!="")
    {
        html+='<div class="m-header m-header2" style="height: 1.2rem;line-height: 1.2rem; background-color: rgb(35, 85, 120);border-bottom: none;padding-top: 0.1rem;font-size: 0;" id="m-header">';
        html+='<div class="layout-1" style="padding:0;" >';
        html+='   <div class="item-1" onclick="history.go(-1)" style="  width: 2rem;  padding-left: 0.3rem;">';
        html+='     <a href="javascript:;" class="left-2"></a>';
        html+='     <a href="javascript:;" class="left-3">返回</a>';
        html+='   </div>';
        html+=' </div>';
        html+=' </div>';
    }
    else if(hrefParam("special-inner")!="" || hrefParam("noneHeader")!=""){
          $(".m-header").hide();
    	   html = "";
    }
    else if(hrefParam("none")!=""){
        $(".m-header").hide();
        html = "";
    }
    else
    {
        html+='<div class="m-header" id="m-header">';
        html+='  <div class="layout-1" style="padding-left: 0.3rem;">';
        html+='   <div class="item-1">';
        html+='     <a href="/" class="left-1"></a>';
        html+=' </div>';
        html+=' <div class="item-2">';
        html+='     <a href="https://admin.cfxdealer.com/" class="right-1">';
        html+='     </a>';
        html+='    <a href="javascript:;" class="right-2" node-name="point">';
        html+='  </a>';
        html+='</div>';
        html+=' </div>';
        html+='	</div>';
    }
    
    document.write(html);
}
function footer()
{
	if(hrefParam("app")!=""|| hrefParam("special")!=""||hrefParam("special-inner")!="" || hrefParam("noneHeader")!="")
	{
	    $(".down-footer").hide();
		html = "";
		document.write(html);
	}
    else if(hrefParam("none")==2){
        $("#m-footer,.down-footer,.copyright").hide();
        html = "";
        document.write(html);
    }
	else {
		var html="";
		html+="<div class=\"footer\" id=\"m-footer\">";
		html+="<div class=\"layout-1\">";
		html+="<ul>";
		html+="<li><a class='referral-footer' href=\"javascript:void(0)\" onclick=\"ga('send', 'event', 'Reg_Real', 'ClickAccount', 'SJ_GW', '1')\"><span></span><em>马上开户</em><i>|</i></a></li>";
		html+="<li><a href=\"https://admin.cfxdealer.com/\"><span></span><em>账户注资</em><i>|</i></a></li>";
		html+="<li><a href=\"https://www.cf-service.com/chat/chatClient/chatbox.jsp?companyID=9013&configID=63\"  onclick=\"ga('send', 'event', 'Chat_Live800', 'Click800', 'SJ_GW', '1');countBiUtil.gwanalysis('2', '0', '2', '', '', '');\"><span></span><em>在线客服</em></a></li>";
		html+=" </ul>";
		html+="</div>";
		html+="</div>	";
		document.write(html);
	}
}
$(function () {
    var domain = document.domain;
    if(domain == "m.cfd139.com.cn"){
        $('.referral-footer').attr("href","//ac.cfd139.com.cn/cn/mobile/rcfd_account"+ window.location.search);
    }else if(domain =="m.cf139.com.cn"){
        $('.referral-footer').attr("href","//ac.cf139.com.cn/cn/mobile/rcfd_account"+ window.location.search);
    }else if(domain =="m.cf139.com"){
        $('.referral-footer').attr("href","//ac.cf139.com/cn/mobile/rcfd_account"+ window.location.search);
    }else if(domain =="m.scdatas.com"){
        $('.referral-footer').attr("href","//ac.scdatas.com/cn/mobile/rcfd_account"+ window.location.search);
    }else {
        $('.referral-footer').attr("href","//ac.cf139.com/cn/mobile/rcfd_account"+ window.location.search);
    }
})

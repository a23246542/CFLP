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
        html+='<div class="m-header" style=" background-color: rgb(35, 85, 120);border-bottom:none";padding-top:0.1rem;height:0.5rem; id="m-header">';
        html+='<div class="layout-1" style="padding:0;height: 0.5rem;line-height: 0.5rem;padding-top:0.1rem;" >';
        html+='   <div class="item-1" onclick="history.go(-1)" style="  width: 1rem;  padding-left: 0.15rem;">';
        html+='     <a href="javascript:;" class="left-4"></a>';
        html+='     <a href="javascript:;" class="left-3">返回</a>';
        html+='   </div>';
        html+=' </div>';
        html+=' </div>';
    }
    else if(hrefParam("special-inner")!=""){
    	   html = "";
    }
    else
    {
        html+='<div class="m-header" id="m-header">';
        html+='  <div class="layout-1" style="padding-left: 0.15rem;">';
        html+='   <div class="item-1">';
        html+='     <a href="/" class="left-1"></a>';
        html+=' </div>';
        html+=' </div>';
        html+='	</div>';
    }
    document.write(html);
}
function footer()
{
	if(hrefParam("app")!=""|| hrefParam("special")!=""||hrefParam("special-inner")!="")
	{
		html = "";
		document.write(html);
	}else {
		var html="";
		html+="<div class=\"footer\" id=\"m-footer\">";
		html+="<div class=\"layout-1\">";
		html+="<ul>";
		html+="<li><a href=\""+id_url+"/cn/mobile/rcfd_account\" onclick=\"ga('send', 'event', 'Reg_Real', 'ClickAccount', 'SJ_GW', '1')\"><span></span><em>马上开户</em><i>|</i></a></li>";
		html+="<li><a href=\"https://admin.cfxdealer.com/\"><span></span><em>账户注资</em><i>|</i></a></li>";
		html+="<li><a href=\"javascript:;\" node-name=\"service\" onclick=\"ga('send', 'event', 'Chat_Live800', 'Click800', 'SJ_GW', '1');countBiUtil.gwanalysis('2', '0', '2', '', '', '');\"><span></span><em>在线客服</em></a></li>";
		html+=" </ul>";
		html+="</div>";
		html+="</div>	";
		document.write(html);
	}
}
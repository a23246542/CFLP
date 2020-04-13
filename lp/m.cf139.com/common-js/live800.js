var cf= cf || {};
var str = window.location.href;
var live800_url= "https://www.cf-service.com/k800/chatClient/chatbox.jsp?companyID=475&configID=56&pagereferrer=" + str +"&intercept_live800";
cf.common = {
	openLive800 : function () {
		window.open(live800_url,"DescriptiveWindowName",
				"resizable,scrollbars=yes,status=1,width=800, height=670, top=100, left=100");
	}
}
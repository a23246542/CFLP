var cf= cf || {};
cf.common = {  
	openQQCustomer : function() {
	 var url = qq_url.replace(/&amp;/g, '&');
        var left = (screen.width/2)-(800/2);
        var top = (screen.height/2)-(550/2);
	 window.open(url, "DescriptiveWindowName", "resizable,scrollbars=yes,status=1,width=800, height=550, top="+top+", left="+left);
	},
	openLive800 : function (queryString) {
        var left = (screen.width/2)-(800/2);
        var top = (screen.height/2)-(670/2);
        var domain = document.domain;
        if (domain != "www.cf860.com" && domain != "www.cf860.net") {
            var url = live800_url;
            if (queryString) {
                url = www_url + '/cn/live800.html?' + queryString;
            }
            window.open(url,"DescriptiveWindowName", "resizable,scrollbars=yes,status=1,width=800, height=670, top="+top+", left="+left);
		}

	}
}
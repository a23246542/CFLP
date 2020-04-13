$.extend({
	mechined:function ()
	{
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
		if(isAndroid) return 0;
		if(isiOS) return 1;
		else return -1;
	},
	jsInvokeAndroid:function(func)
	{
		eval("window.android."+func+"()");
	},
	share:function(title,content,url,imageUrl)
	{
		if($.mechined()==1)
			shareContent(title,content,url,imageUrl);//invokeIos("shareContent",param,callback);
		else
			uiObject.shareContent(title,content,url,imageUrl);
	}
});

/*//如若html要调用ios的native方法，得在html加上var registerHandlers = new Array(""); 此句初始语句，此句放在之前
//如果是ios的系统，且要调用或被ios调用的方法不为空，则初始化WebViewJavascriptBridge

//建立桥接
if($.mechined()==1 && typeof registerHandlers != "undefined")  
{
	setupWebViewJavascriptBridge(function(bridge) {
		if(registerHandlers.length>0)
		{
			if(registerHandlers.length==1)
			{
				var registerHandlers_ob =registerHandlers[0];
				bridge.registerHandler(registerHandlers_ob, function(data, responseCallback) {
					window[registerHandlers_ob](data);
				    responseCallback(data);
			     });
			}
			else 
			{
				registerMutilHandler(bridge); 
			}
		}
	})
}

//建立与ios的桥接
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}
//处理类，子类js进行实现，如不实现，则不做任何处理
function registerMutilHandler(bridge){}
//js调用IOS原生方法的实现
function invokeIos(method,param,callback)
{
	WebViewJavascriptBridge.callHandler(method, param, function(response) {
		if($.isFunction(callback))
			callback(response);
    });
}*/

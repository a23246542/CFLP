var cookieInfo = {
	getsec:function(str){
		alert(str);
	    var str1=str.substring(1,str.length)*1;
	    var str2=str.substring(0,1);
	    if (str2=="s")
	    {
	    	return str1*1000;
	    }
	    else if (str2=="h")
	    {
	    	return str1*60*60*1000;
	    }
	    else if (str2=="d")
	    {
	    	return str1*24*60*60*1000;
	    }
	},
	setCookie:function(name,value){
	    var Days = 30;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    getCookie:function(name){
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg))
	    return unescape(arr[2]);
	    else
	    return null;
    },
    delCookie:function(name){
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=cookieInfo.getCookie(name);
	    if(cval!=null)
	    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
		
}




    
    
    
    
    
    
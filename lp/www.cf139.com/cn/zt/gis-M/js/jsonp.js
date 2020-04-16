var jsonpData=function(options,callbackSuc,callbackErr)
{
    if(!options.type){
        options.type = "get";
    }
    return $.ajax({
        type : options.type,
        url : options.url,
        data:options.data,
        dataType : "jsonp",//数据类型为jsonp
        jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数
        success : function(data){
            if($.isFunction(callbackSuc))callbackSuc(data);},
        error:function(){if($.isFunction(callbackErr))callbackErr(); }
    });
}
//加载script
$.loadScript = function (url,callBack) {
    var head = document.getElementsByTagName("HEAD").item(0);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if(callBack!=null){
        script.onreadystatechange = function () {
            if(this.readyState == 'complete'){
                callBack();
            }
        }
        script.onload = callBack;
    }
    head.appendChild(script);
};

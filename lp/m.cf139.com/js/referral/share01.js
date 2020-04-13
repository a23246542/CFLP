/**分享相关代码--larry*/




$(function () {
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    //先检查是否存在code参数，如果有、组装二维码、注册相关分享事件
    var pram = {
        code:GetQueryString("code"),
        phoneAes:null
    };

    if(pram.code==null||pram.code===""){
        return ;
    }
    function getPhone(customerTel) {
        return customerTel.replace(/^(\d{4})\d{4}(\d+)/, "$1****$2");
    }
    share(pram.code);
   function share(code){
       $.ajax({
           type : "GET",
           contentType : "text/plain",
           url :  mis_url +"/public/customerRelation/decryptPhone?code="+ code,
           async : false,
           success : function(data) {
               if(data==null||data.data==""){
                   $(".tuijian-tip").show().html("推荐人不存在")
               }else{
                   $(".tuijian-tip").hide()
                   var phone = data.data;
                   $("#directRecommender01").val(getPhone(phone))
                   $("#phoneText").empty().html(getPhone(phone))
                   $("#directRecommender02").val(phone)
               }
           },
           error : function(jqXHR, textStatus, errorThrown) {
               console.log(textStatus + errorThrown);
           }
       })
   }
})





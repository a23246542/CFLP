$.extend({
    //中文状态
    status:function (result) {
        var imgUrl,dataobj,text;
        if(result.topicStatus == "1"){
            dataobj ={
                imgUrl :'../images/super-topic/fire.png',
                text:'进行中'
            }
        }else if(result.topicStatus == "2"){
            dataobj ={
                imgUrl :'../images/super-topic/ever.png',
                text:'未开启'
            }
        }else if(result.topicStatus == "3"){
            dataobj ={
                imgUrl :'../images/super-topic/over.png',
                text:'往期'
            }
        }
        return dataobj
    },
    //英文状态背景
    statuss:function (sta) {
        if(sta =="未开启"){
            return  "blue"
        }else if(sta =="往期"){
            return "grey"
        }else{
            return "red"
        }
    },
    //状态url
    statusu:function (sta,idData) {
        if(sta =="未开启" ){
            return  "javascript:void(0)"
        }else if(sta =="进行中" || sta =="往期"){
            if($.tail()){
                $(".footer-con").html('');
                return "/cn/zt/super-topic/topic_detail_new.html?topicId="+idData.topicId+"&" + $.tail();
            }
            return "/cn/zt/super-topic/topic_detail_new.html?topicId="+idData.topicId+""
        }
    },
    //判断尾巴是否含有 noneheader
    tail:function () {
        var tailText = window.location.search.slice(1);
        console.log(tailText)
        if(tailText.indexOf("noneheader") != -1){
            return tailText
        }
    },
    //格式化日期
    dateFormat:function (longTypeDate) {
        var dateType = "";
        var date = new Date();
        date.setTime(longTypeDate);
        dateType =  $.getFullPart(date.getMonth() + 1) + "/" + $.getFullPart(date.getDate()) + " " + this.getFullPart(date.getHours())
            + ":" + this.getFullPart(date.getMinutes()) ;
        return dateType;
    },
    /**
     * 时间格式转化
     * @param longTypeDate
     * @returns {string}
     */
    dateFormatFull:function (longTypeDate) {
        var dateType = "";
        var date = new Date();
        date.setTime(longTypeDate);
        dateType = date.getFullYear() + "-" + this.getFullPart(date.getMonth() + 1) + "-" + this.getFullPart(date.getDate()) + " " + this.getFullPart(date.getHours())
            + ":" + this.getFullPart(date.getMinutes()) + ":" + this.getFullPart(date.getSeconds());
        return dateType;
    },
    getFullPart:function (day) {
        return day < 10 ? "0" + day : day;
    }
});
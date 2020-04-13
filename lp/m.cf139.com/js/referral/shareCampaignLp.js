var cfApp = angular.module("cfApp",[]);
cfApp.filter('relationTypeFilter', function() { //可以注入依赖
    return function(text) {
        var dd ="";
        if(text==0) dd="客户";
        if(text==1) dd="直接";
        if(text==2) dd="间接";
        return dd;
    }
});
cfApp.filter('symbolTypeFilter', function() { //可以注入依赖
    return function(text) {
        var dd ="";
        if(text==0) dd="外汇";
        if(text==1) dd="贵金属";
        if(text==2) dd="指数";
        if(text==3) dd="原油";
        return dd;
    }
});
StringUtils = {
    isEmpty : function(s){
        if($.trim(s) == "")
            return true;
        return false;
    },
    tolowerCase : function (str){
        return str.toLowerCase();
    }
}
cfApp.filter('formatPhone', function() { //可以注入依赖
    return function(text) {
        if(StringUtils.isEmpty(text)){
            return "";
        }
        var text1 = text.substring(0,3);

        var text2 = text.substring(text.length-4);
        return text1+"****"+text2;
        // return text.substring(0,4);
    }
});
cfApp.filter('chineseNameFileter', function() { //可以注入依赖
    return function(text) {
        var dd ="";
        if(text==null||text==""){
            return dd;
        }
        var t = text.substring(0,1);
        return t+"**";
    }
});

function _add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (_mul(a, e) + _mul(b, e)) / e;
}

function _sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (_mul(a, e) - _mul(b, e)) / e;
}

function _mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function _div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), _mul(c / d, Math.pow(10, f - e));
}
/**加*/
Number.prototype.add = function (arg) {
    return _add(this,arg)
}
/**剪*/
Number.prototype.sub = function (arg) {
    return _sub(this,arg)
}
/**乘*/
Number.prototype.mul = function (arg) {
    return _mul(this,arg)
}
/**除*/
Number.prototype.div = function (arg) {
    return _div(this,arg)
}

cfApp.controller("customerController",function($scope, $http, $timeout,$filter,$log){

    //页面查询参数
    $scope.queryParm ={
        pageType:1,//tab类型
        dateType:3,//查询范围
        start:0,//第几页
        length:10,//显示几条

    }

    $scope.totalInfo = {direct:0,indirect:0,sumDirect:0,sumIndirect:0};
    $scope.queryUrl =mis_url+"/public/customerRelation/queryByPage";
    $scope.querySumUrl =mis_url+"/public/customerRelation/querySumInfo";
    $scope.totalInfoUrl = mis_url+"/public/customerRelation/getTotalInfo";
    $scope.getPhoneByAccountUrl = mis_url+"/public/customerRelation/getPhoneByAccount";

    $scope.checkUrl =mis_url+"/public/customerRelation/checkCustomerActiveStatus";

    $scope.title1=["新客户","姓名","推荐类型","是否激活","开户时间","是否达标"];
    $scope.title2=["新客户","姓名","奖励类型","奖励金额","时间"];
    $scope.title3=["新客户","姓名","单号","交易产品","交易手数","交易时间","返利类型","返利金额"];

    $scope.title11=["新客户","推荐类型","是否激活","开户时间","是否达标"];
    $scope.title22=["新客户","奖励类型","奖励金额","时间"];
    $scope.title33=["新客户","单号","交易手数","交易时间","返利金额"];

    $scope.pageTitle = $scope.title1;
    $scope.pageTitle1 = $scope.title11;
    $scope.pageData = {}//页面分页展示数据
    $scope.currentPage = 1;
    $scope.timeInput = true;

    /**初始化数据*/
    $scope.init = function () {
        //初始化总的赠金和返利数据
        $scope.sumDirectByTop =0;
        $scope.sumIndirectByTop = 0;

        $http.post($scope.totalInfoUrl,$scope.queryParm).then(function (resp) {
            if(resp.status ==200){
                if(resp.data.direct==null||resp.data.direct==""){
                    resp.data.direct = 0;
                }
                if(resp.data.indirect==null||resp.data.indirect==""){
                    resp.data.indirect = 0;
                }
                $scope.sumDirectByTop = resp.data.direct;
                $scope.sumIndirectByTop = resp.data.indirect;
            }
        })
        $scope.queryPage();

        $http.post($scope.getPhoneByAccountUrl,$scope.queryParm).then(function (resp) {
            if(resp.status ==200){
                $scope.queryParm.phone = resp.data.msg;
            }
        })

        $(function () {
            lay('#version').html('-v'+ laydate.v);

            //执行一个laydate实例
            laydate.render({
                elem: '#date1' //指定元素
                ,done:function (value) {
                    $scope.queryParm.beginDate = value;
                }
            });
            laydate.render({
                elem: '#date2' //指定元素
                ,done:function (value) {
                    $scope.queryParm.endDate = value;
                }
            });
            laydate.render({
                elem: '#date3' //指定元素
                ,done:function (value) {
                    // $("#date3").val(value);
                    $scope.queryParm.beginDate = value;
                }
            });
            laydate.render({
                elem: '#date4' //指定元素
                ,done:function (value) {
                    // $("#date4").val(value);
                    $scope.queryParm.endDate = value;
                }
            });

        })
    }

    /**tab页切换*/
    $scope.changePage = function (pageType) {

        $scope.queryParm.pageType = pageType;
        $scope.queryParm.start = 0;
        $scope.totalInfo.direct = 0;
        $scope.totalInfo.indirect = 0;
        $scope.totalInfo.sumDirect = 0;
        $scope.totalInfo.sumIndirect = 0;

        if(1==pageType){
            $scope.pageTitle = $scope.title1;
            $scope.pageTitle1 = $scope.title11;
        }else if(2==pageType){
            $scope.pageTitle = $scope.title2;
            $scope.pageTitle1 = $scope.title22;
        }else {
            $scope.pageTitle = $scope.title3;
            $scope.pageTitle1 = $scope.title33;
        }
        $scope.currentPage = 1;
        if($scope.queryParm.dateType==3){
            $scope.pageData = {};
            // return;
        }
        $scope.queryPage();
    }
    /**获取兄弟元素 */
    $scope.getsiblings=function(elm){
        var a = [];    //保存所有兄弟节点
        var p = elm.parentNode.children; //获取父级的所有子节点
        for(var i = 0; i < p.length; i++){  //循环
            if(p[i].nodeType == 1 && p[i] != elm){  //如果该节点是元素节点与不是这个节点本身
                a.push(p[i]);      // 添加到兄弟节点里
            }
        } 
       return a;
    }

    $scope.changeDateType = function (dateType,$event) {
        $event.target.setAttribute("class","active");
        var sibling = this.getsiblings( $event.target.parentNode);
        for(var j = 0; j < sibling.length; j++){
            // console.log(sibling[j].children[0])
            sibling[j].children[0].setAttribute('class',"")//这样就可以对所有的兄弟节点执行你需要的操作了
        }
        $scope.queryParm.dateType = dateType;
        $scope.queryParm.start = 0;
        $scope.currentPage = 1;
        $scope.totalInfo.direct = 0;
        $scope.totalInfo.indirect = 0;
        $scope.totalInfo.sumDirect = 0;
        $scope.totalInfo.sumIndirect = 0;
        if(3==dateType){
            // $scope.$apply();
            $scope.timeInput = true;
            $scope.pageData = {};
            // return;
        }else {
            $scope.timeInput = false;
        }
        $scope.queryPage();
    }

    /**数据查询方法*/
    $scope.queryPage = function () {
        $http.post($scope.queryUrl,$scope.queryParm).then(function (resp) {
            if(resp.status==200){
                $scope.convertPage(resp.data);
            }
        })
    }

    /**下一页*/
    $scope.nextPage = function () {
        if($scope.currentPage>=$scope.pageData.pageCount){
            return;
        }
        $scope.currentPage+=1;
        var start = ($scope.currentPage-1)*$scope.pageData.length;
        $scope.queryParm.start = start;
        $scope.queryPage();
    }
    /**上一页*/
    $scope.prevPage = function () {
        if($scope.currentPage<=1){
            return;
        }
        $scope.currentPage-=1;
        var start = ($scope.currentPage-1)*$scope.pageData.length;
        $scope.queryParm.start = start;
        $scope.queryPage();
    }

    /**处理传回的分页数据*/
    $scope.convertPage = function(page){
        $scope.pageData = page;
        $scope.pageData.pageCount=0;
        var pageCount = $scope.pageData.recordsTotal%$scope.pageData.length
        if(pageCount>0){
            $scope.pageData.pageCount+=1;
        }
        $scope.pageData.pageCount += parseInt($scope.pageData.recordsTotal/$scope.pageData.length);
        //调用方法处理统计
        $scope.converLocalSum();
        $scope.converServerSum();
    }

    $scope.converServerSum = function () {
        $http.post($scope.querySumUrl,$scope.queryParm).then(function (resp) {
            if(resp.status==200){
                if(resp.data.direct==null || resp.data.direct==""){
                    resp.data.direct=0;
                }
                if(resp.data.indirect==null || resp.data.indirect==""){
                    resp.data.indirect=0;
                }
                $scope.totalInfo.sumDirect = resp.data.direct;
                $scope.totalInfo.sumIndirect = resp.data.indirect;
            }
        })
    }

    $scope.converLocalSum = function () {
        $scope.totalInfo = {direct:0,indirect:0,sumDirect:0,sumIndirect:0};
        angular.forEach($scope.pageData.data, function(data,index,array){
            if($scope.queryParm.pageType==1){//直接新增人数
                if(data.relationType=='直接'){
                    $scope.totalInfo.direct+=1;
                }
                if(data.relationType=='间接'){
                    $scope.totalInfo.indirect+=1;
                }
            }else {
                if(data.relationType==1){
                    $scope.totalInfo.direct = ($scope.totalInfo.direct).add(data.currentRebete);
                }
                if(data.relationType==2){
                    $scope.totalInfo.indirect = ($scope.totalInfo.indirect).add(data.currentRebete);
                }
            }
        });
    }

    /**验证当前客户是否激活*/
    //    推荐弹窗
    $scope.active = function () {
       $scope.queryParm.code = localStorage.getItem("numberCode")
        $http.post($scope.checkUrl,$scope.queryParm).then(function(resp){
            convertActiveResult(resp,$scope.queryParm.code);
        });
    }

    $scope.enterToPage = function () {
        $('.m-mask').hide();
        //window.location.href = m_url+"/cn/zt/referral/recommended-record.html?code="+$scope.queryParm.code;
        // if(isApp){
        //     //$(".rec-header").hide();
        //     window.location.href = m_url+"/cn/zt/referral/recommended-record.html?app=1&code="+$scope.queryParm.code;
        // }
        // else{
        //     window.location.href = m_url+"/cn/zt/referral/recommended-record.html?code="+$scope.queryParm.code;
        // }
    }


    $scope.init();
});
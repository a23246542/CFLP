const state = {
    // login.account
    // api 的激活
    // lotteryDollar:
}
// var phone = $.trim($("#phone").val());
// $.setCookie("accountId", phone);
var longin = {
    account: $.getCookie("accountId")
}
const api = {
    initUser:"https://api.",//loadformApp 样实现自动登入跟拿取使用者资料
    // actId:
    activation: mis_url + "/public/customer/act/" + data.account, 
    initZongzi:pre_op + "/api/activity/luckyDrawReCord/beforeRaffle",
    lotteryZongzi:pre_op + "/api/activity/luckyDrawReCord/startRaffle",
}
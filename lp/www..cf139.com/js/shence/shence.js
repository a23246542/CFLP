
$(function () {

    var eventTypes = ['phone_code','voice_code','phone_reg_success','account_reg_success','reg_deposit','download_CFD','account_reg'];
    var regModels = ['pc', 'mobile', 'app'];//reg_mode
    var regTypes = ['normal', 'live', 'lp'];//reg_mode
    var accountTypes = ['真实账户','模拟账户'];
    var scAttr = "sc-attr";

    var initAttr = function () {
        var targets = $("[" + scAttr + "]");
        if (targets.length < 1) {
            return;
        }
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var attrValue = $(target).attr(scAttr);
            var values = attrValue.split("|");
            ctrlEvent(target,values);
        }
    }

    //method
    var ctrlEvent = function(target,values){
        var eventType = eventTypes[values[0]];
        var param = {};
        if('download_CFD'===eventType){
            param = getDownJson(values);
        }else {
            param = getRegJson(values);
        }

        $(target).click(function () {
            sa.track(eventType,param);
        })
    }

    var getRegJson = function(values){
        var regType = regTypes[values[1]];
        var param = {
            account_reg_type:accountTypes[0],
            reg_mode:regModels[pageType],
            reg_type:regType
        };
        if(isDemo){
            param.account_reg_type = accountTypes[1];
        }
        param.reg_page_url = window.location.href;
        return param;
    };

    var getDownJson = function(values){
        var param = {
            download_mode:regModels[pageType]
        };
        param.download_page_url = window.location.href;
        return param;
    };
    initAttr();
});

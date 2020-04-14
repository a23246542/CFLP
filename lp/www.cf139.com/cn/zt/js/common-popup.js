var popup = popup || {};

// close popup function
popup.closePopup = function(idName, className) {
    var winClose = $(className + " .win-close");
    $(idName).click(function() {
        $(className).removeClass('show').addClass('hide');
        $(this).css({
            display: 'none',
            left: '0'
        });
    });
    winClose.click(function() {
        $(className).hide();
        $(idName).hide();
    });
}

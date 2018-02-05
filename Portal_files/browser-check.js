$(function(){
	$("#browser-check-modal").dialog({
		resizable: false,
		width: 500,
		modal: true,
		autoOpen: false,
		buttons: {
			Ok: function() {
				$(this).dialog( "close" );
			}
		}
	});
	
	var unsupportBrowser = false;
//    if ($.browser.msie)
//    {
//       if ($.browser.version != '8.0')
//           unsupportBrowser = true;
//    }
//    else{
//       unsupportBrowser = true;
//    }
    
    if (unsupportBrowser){
    	$("#browser-check-modal").dialog("open");
    }
});    
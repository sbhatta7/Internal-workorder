$(function(){
	$(document).delegate("[title]:not(.tip-init)","mouseenter",function(){
	       $(this).tooltip({
    		   	position: "top right",
				offset: [5, 10],
				effect: "fade",
				delay: 60
	       });
	       $(this).trigger("mouseenter");
	       $(this).addClass("tip-init");
	});
	    	
	
});
//To perform Delete action for the request ID which is in Draft : status
function deleteDraft(transaction) {
		
		var r=confirm("Please click on 'OK' if you want to delete this request.");
		if (r==true)
		{		  
			var url = "deleteDraft.do?transactionId="+transaction;
			deleteDraftRequest(url);
		}	
}
//function to delete the draft
function deleteDraftRequest(url)
{
	$.ajax({
        url: url,
        type: 'GET',
        processData: false,
        contentType: 'application/json',
        success: function(){
            alert("Your draft request has been deleted successfully!");
            window.location.reload();            
        },
        error: function(xhr, textStatus, thrownError){
        	alert("Error Deleting Draft!");
        }
	});	
}
//This is the eup namespace, put methods in here!
(function( eup, $, undefined ) {
	
	//Private properties
	var statusInfoNeeded = "Information Needed",
		statusCancelled = "Cancelled",
		statusDraft = "Draft",
		statusSubmitted = "Submitted",
		statusHpsmOnly = "HPSM Only";
	
	eup.setupRequests = function( options ) { 
    
        // Create some defaults, extending them with any options that were provided
	    var settings = $.extend( {
	      eid          : '',
	      displayLength: 10,
	      sDom         : 'lftip',
	      bInfo        : true,
	      bSort        : true,
	      bFilter      : true,
	      newSort      : []
                
	    }, options);
        
        if(! this.selector ){
            var dataTableRequests = [];
			$.ajaxSetup({ cache: false });
			
			$.getJSON("loadUserRequests.json.do?eid=" + settings.eid, function(data){
				$.each(data, function(key, val){
					//push data onto display table in expected format
					
					if(val.status === statusInfoNeeded) { val.statusOrder = '0'; }
					else if(val.status === statusDraft) { val.statusOrder = '1'; }
					else val.statusOrder = '2';
										
					formatDate(val, "requestDate", "requestDateText", "requestDateOrder", false);
					formatDate(val, "requestedByDate", "requestedByDateText", "requestedByDateOrder", false);
					
					dataTableRequests.push([
						val.requestNumber,
						val.title, 
						val.requesteeFullName + "/" + val.requestedFor.toLowerCase(),
						val.requestType,
						val.status,
						val.requestDateText,
						val.requestedByDateText, //targetDateText
						"",//edit
						"",//copy
						val.statusOrder,
						val.requestDateOrder,
						val.userNotes,
						val.transactionId
					]);
				});//end each
				
				$('#summaryTable').dataTable( {
						"aaSorting": [[10,"desc"],[ 9,"asc" ]],
						"aoColumnDefs": [
							{"bVisible": false, "aTargets": [9,10,11,12]},
							//{"iDataSort": 9, "aTargets": [4]}, //status sorting
							{"iDataSort": 10, "aTargets": [5]}, //date sorting
							{"bSortable": false, "aTargets": [7,8]}
							],
						"bJQueryUI": true,
						"bPaginate": true,
						"iDisplayLength": settings.displayLength,
						"bInfo": settings.bInfo,
						"bFilter": settings.bFilter,
						"bSort": settings.bSort,
						"sDom": settings.sDom,
						"fnRowCallback": requestDataTableRowCallback,
						"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
						"bRetrieve": true,
						"aoColumns": 
							[
					            { sWidth: '10%' },
					            { sWidth: '30%' },
					            { sWidth: '10%' },
					            { sWidth: '10%' },
					            { sWidth: '10%' },
					            { sWidth: '10%' },
					            { sWidth: '10%' },
					            { sWidth: '0%' },
					            { sWidth: '10%' }]
					});
					
				
					$('#summaryTable').dataTable().fnClearTable(false);
					$('#summaryTable').dataTable().fnAddData(dataTableRequests);
					//apply new sorting
					if(!$.isEmptyObject(settings.newSort)){
						$('#summaryTable').dataTable().fnSort(settings.newSort);
					}
				$.ajaxSetup({ cache: true });
	        });//end getJSON
		}//end if
    };//end setupRequests
    
    eup.setupApprovals = function( options ) { 
        
        // Create some defaults, extending them with any options that were provided
	    var settings = $.extend( {
	      eid          : '',
	      displayLength: 10,
	      sDom         : 'lftip',
	      bInfo        : true,
	      bSort        : true,
	      bFilter      : true,
	      newSort      : []
                
	    }, options);
        
        if(! this.selector ){
            var dataTableRequests = [];
			$.ajaxSetup({ cache: false });
			
			$.getJSON("loadApprovals.json.do?eid=" + settings.eid, function(data){
				$.each(data, function(key, val){
					formatDate(val, "submittedDate", "submittedDateText");

					dataTableRequests.push([
						val.subRequestId,
						val.requestId,
						val.requestType,
						val.title,
						val.requestedFor,
						val.submittedDateText,
						val.status,
						"",
						val.sequence
					]);
				});//end each
				
				$('#approvalTable').dataTable( {
						"aaSorting": [[4,"desc"]],
						"bInfo": settings.bInfo,
						"bFilter": settings.bFilter,
						"bSort": settings.bSort,
						"sDom": settings.sDom,
						"bRetrieve":true,
						"fnRowCallback": approvalTableRowCallback,
			            "aoColumns": 
						[
				            { sWidth: '10%' },
				            { sWidth: '10%' },
				            { sWidth: '10%' },
				            { sWidth: '25%' },
				            { sWidth: '10%' },
				            { sWidth: '15%' },
				            { sWidth: '10%' },
				            { sWidth: '10%' },
				            { sWidth: '0%' }]
					});
				$('#approvalTable').dataTable().fnClearTable(false);
				$('#approvalTable').dataTable().fnAddData(dataTableRequests);
				$.ajaxSetup({ cache: true });
	        });//end getJSON
		}//end if
    };//end setupApprovals
    
    eup.setupSoftware = function( options ) { 
        
        // Create some defaults, extending them with any options that were provided
	    var settings = $.extend( {
	      eid          : '',
	      displayLength: 10,
	      sDom         : 'lftip',
	      bInfo        : true,
	      bSort        : true,
	      bFilter      : true                
	    }, options);
        
        if(! this.selector ){
            var dataTableRequests = [];
			$.ajaxSetup({ cache: false });
			
			$.getJSON("loadSoftwareRequests.json.do?eid=" + settings.eid, function(data){
				$.each(data, function(key, val){
					formatDate(val, "timestamp", "submittedDateText");

					dataTableRequests.push([
						val.hpsmId,
						val.title,
						val.productName,
						val.submittedDateText,
						val.status,
					]);
				});//end each
				
				$('#softwareRequestTable').dataTable( {
						"aaSorting": [[3,"desc"]],
						"bInfo": settings.bInfo,
						"bFilter": settings.bFilter,
						"sDom": settings.sDom,
						"bRetrieve":true,
						"bsort":false,
						"fnRowCallback": softwareTableRowCallback,
						"aoColumns": 
							[
					            { sWidth: '10%' },
					            { sWidth: '50%' },
					            { sWidth: '20%' },
					            { sWidth: '10%' },
					            { sWidth: '10%' }]
					});
				$('#softwareRequestTable').dataTable().fnClearTable(false);
				$('#softwareRequestTable').dataTable().fnAddData(dataTableRequests);
				$.ajaxSetup({ cache: true });
	        });//end getJSON
		}//end if
    };//end setupSoftware
    
	//private method - callback for applying styles and links to request data table rows
	var requestDataTableRowCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
		
		var reqId = aData[0],
			status = aData[4],
			note = aData[11],
			transaction = aData[12];
		
		
		//some rows hit the row callback twice, this ensures the edit icon is not leftover on a draft row
		$('td:eq(7)', nRow).html('');
		
		//add notes icon
		/*
		 * Commented the below for the RFC C00623120 - ASHOK - 01/19/2012 - START
		 */
		//if (status === statusCancelled) {
		//	if(note){
			//$('td:eq(7)', nRow).html( '<a class="note_tip" title="' + note + '"><img src="resources/images/notes.png"></a>' );
		//	}
		//}
		/*
		 * Commented the below for the RFC C00623120 - ASHOK - 01/19/2012 - START
		 */
	
		//add copy and print icons
		if (status !== statusDraft && status !== statusInfoNeeded) {
			$('td:eq(8)', nRow).html( '<a title="Copy Request" href="copyRequest.do?requestNumber='+reqId+'"><img src="resources/images/copy.png"></a>&nbsp;<a title="Print Request" href="printRequest.do?requestNumber='+reqId+'" target="_blank"><img src="resources/images/print_icon.png"></a>' );
		}
	
		if (status === statusInfoNeeded) {
			 var rowObject = $('td', nRow).closest('tr');
			 
			 //make id an edit link
			 $('td:eq(0)', nRow).html('<a title="Edit Request" href="editRequest.do?requestNumber=' + reqId + '">' + reqId + '</a>');
			 $('td:eq(8)', nRow).html('<a title="Print Request" href="printRequest.do?requestNumber='+reqId+'" target="_blank"><img src="resources/images/print_icon.png"></a>' );

			 if(rowObject.hasClass("odd")) {
				 rowObject.removeClass("odd requestInProgressEven");
				 rowObject.addClass("requestInProgressOdd");
			 }
			 else if(rowObject.hasClass("even")) {
				 rowObject.removeClass("even requestInProgressOdd");
				 rowObject.addClass("requestInProgressEven");
			 }
		}
		//Removing because it puts approval process in weird state.  Cancelled requests can and _should_ be copied if they need to be resubmitted.
//		// Added for the RFC C00623120 -- 1/19/2012 - START
//		else if (status === statusCancelled) {
//			var rowObject = $('td', nRow).closest('tr');
//			//make id an edit link
//			$('td:eq(0)', nRow).html('<a title="Edit Request" href="editRequest.do?requestNumber=' + reqId + '">' + reqId + '</a>');
//			
//		}
		// Added for the RFC C00623120 -- 1/19/2012 - END
		else if (status === statusDraft) {
			var rowObject = $('td', nRow).closest('tr');
			
			//display the transaction number if there is no reqID
			if (!reqId){ reqId = transaction;}
		 
			//make id an edit link - always display the reqID, since a draft could have a request associated
			$('td:eq(0)', nRow).html( '<a title="Edit Request" href="resumeDraft.do?transactionId='+transaction+'">' + reqId + '</a>' );
			$('td:eq(8)', nRow).html( '<a title="Print Request" href="printRequest.do?requestNumber='+reqId+'" target="_blank"><img src="resources/images/print_icon.png"></a>&nbsp;<a title="Delete Draft" href="javascript:deleteDraft('+transaction +')"><img src="resources/images/delete_draft.png"></a>' );

			if(rowObject.hasClass("odd")) {
				rowObject.removeClass("odd requestDraftEven");
				rowObject.addClass("requestDraftOdd");
			}
			else if(rowObject.hasClass("even")) {
				rowObject.removeClass("even requestDraftOdd");
				rowObject.addClass("requestDraftEven");
			}
			 
		}
		else {
			 var rowObject = $('td', nRow).closest('tr');
			 if(rowObject.hasClass("odd")) {
				 rowObject.removeClass("odd requestDefaultEven");
				 rowObject.addClass("requestDefaultOdd");
			 }
			 else if(rowObject.hasClass("even")) {
				rowObject.removeClass("even requestDefaultOdd");
				rowObject.addClass("requestDefaultEven");
			}
		}
		
		if(status != statusHpsmOnly){
			 $('td:eq(8)', nRow).append('&nbsp;<a title="Sub Request History" href="requestApprovalHistory.do?requestNumber=' + reqId + '" target="_blank"><img id="historyImg'+iDisplayIndex+'" src="resources/images/history_folder.png"></a>' );
		}
	return nRow;
	};
	
	var approvalTableRowCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
		
		var rowObject = $('td', nRow).closest('tr');
		var subRequestId = aData[0];
		var sequence = aData[8];
		//make id an edit link
		$('td:eq(0)', nRow).html('<a title="Edit Request" href="subRequestApproval.do?subRequestNumber=' + subRequestId + '&sequence=' + sequence +'" target="_blank">' + subRequestId + '</a>');
		$('td:eq(7)', nRow).html('<a title="Sub Request History" href="approvalHistory.do?subRequestNumber=' + subRequestId + '" target="_blank"><img id="historyImg'+iDisplayIndex+'" src="resources/images/history_folder.png"></a>' );
		$('td:eq(8)', nRow).hide();
		   
		return nRow;
	};
	
	var softwareTableRowCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
		   
		return nRow;
	};
	
	//private Method
    var formatDate = function(dict, dateField, dateText, dateOrder, includeTime ){
		//includeTime is an optional bool param
		
		//set defaults	
		dict[dateText] = "N/A";
		dict[dateOrder] = 0;
		
		if (dict[dateField] != null)
		{
			var newDate = new Date(dict[dateField]['time']),
				month = ('0' + (newDate.getMonth() + 1)).slice(-2), //months are 0 based so add 1
				day = ('0' + newDate.getDate()).slice(-2),
				formattedDate = month + "/" + day + "/" + newDate.getFullYear();
			
			if(includeTime){
				var time = newDate.toLocaleTimeString();
				formattedDate += " " + time;
			} 
				
			dict[dateText] = formattedDate;
			dict[dateOrder] = newDate.getTime();
		}
	};

}( window.eup = window.eup || {}, jQuery ));
	
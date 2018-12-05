var apikey= null;
var url = "https://localhost:9999"; //https needed for iframe! use ngrok or ssl proxy to test local or sandbox url

$( document ).ready(function() {
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	apikey = response.apikey;
	  
	if(apikey == null || apikey == ""){
			apikey = -1;
			alert("Click the bunq icon in the browser to configure your awesome experience!");
			return;
		}
		replaceQR();
	});	
});

var backupQR;
function replaceQR (){
	//return;
	var qrDiv = $(".qr-code-image-view")[0];
	if (!qrDiv){
		setTimeout(replaceQR, 100);	
		return;
	}

	var queryParam = window.location.search;
	
	backupQR = qrDiv.childNodes[1];
	var base64String = backupQR.src;
	qrDiv.removeChild(backupQR);
	
	$.post(url+"/rest/bunqservice/v1/qrcode", '{"base64" : "' +  base64String + '", "apikey" : "'+ apikey + '", "amount":"'+$(".transaction-amount")[0].childNodes[1].innerHTML+'"}', function(result){     
		var ifrm = document.createElement("iframe");
		ifrm.setAttribute("src", url+"/link/handlebunq/" + result);
		ifrm.style.width = "480px";
		ifrm.style.height = "240px";
		ifrm.frameBorder  = "0";
		
		document.getElementsByClassName("qr-code-image-view")[0].appendChild(ifrm);
	}).fail(function(response) {
		$(".qr-code-image-view").append("<div style='padding:20px'><a  id='findmyphone' class='button button-action button-action-orange ' style='margin:20px;' >Find my phone</a></div>");
		$("#findmyphone").click(function(){
			$("#findmyphone")[0].innerHTML = "We're calling you..";
			$.post(url+"/rest/bunqservice/v1/findmyphone", '{"apikey" : "'+ apikey + '"}', function(result){	
				$("#findmyphone")[0].innerHTML = "You're 📳 is ringing now";
			}).fail(function(response) {
				$("#findmyphone")[0].innerHTML = "We had trouble calling, go find it yourself now!";
			});
		});
		qrDiv.appendChild(backupQR);
	});;
	return true;
}

var downCount = 11;
// check for continue button
var timeOutButton = setInterval(function(){
	var continueButton = $('.button-action-continue')[0];
	
	if(continueButton != null){
		$('.button-action-continue')[0].innerHTML = "Continue in " + downCount + " seconds";
		//alert('clear');
		clearInterval(timeOutButton);
		
		var int2 = setInterval(function(){
			//alert('downcount');
			if(downCount != 0){
				downCount--;
			}
			$('.button-action-continue')[0].innerHTML = "Continue in " + downCount + " seconds";
			if(downCount == 0){
				$('.button-action-continue')[0].click();
				clearInterval(int2);
			}		
		},1000);
	}
}, 300);
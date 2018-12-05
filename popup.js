$( document ).ready(function() {
	var apikey=-1;
	var url = "https://localhost:9999"; //https needed for iframe! use ngrok or ssl proxy to test local or sandbox url
	
	if(localStorage.getItem("apikey") == null){
		apikey = -1;
	}
	else{
		apikey = localStorage.getItem("apikey");
	}
	
	var ifrm = document.createElement("iframe");
		ifrm.setAttribute("src", url+"/link/my0crapconfig/" + apikey );
		ifrm.style.width = "440px";
		ifrm.style.height = "480px";
		ifrm.frameBorder  = "0";
		document.body.appendChild(ifrm);
		
});

window.addEventListener('message', function(e) {
	localStorage.setItem("apikey", e.data);
});

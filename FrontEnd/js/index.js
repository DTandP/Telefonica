// index.js

// request message on server
//Calls SimpleServlet to get the "Hello World" message


	
	
	
	var count=1;
	var temp;
	$(document).ready(function(e){
		$("#callDialogs").click(function(e){

			console.log("ghusa");
			var msgBlock = document.getElementById('msgBlock').value;
/*			//document.getElementById("msgBlock").value = "";
			$("#msgBlock").val("");
			console.log("in Js block: "+msgBlock);*/
			$.get("http://localhost:6080/api/nlcGetInitialData?msg="+msgBlock+"&count="+count, function(responseText){
				// add to document
				//var mytitle = document.getElementById('message');
				temp = parseJson(responseText);
			$("#container").append('<div class="user-chat"><p>'+msgBlock+'</p></div><br><br><br><br>');
			$("#container").append('<div class="npc-chat"><div class ="npcChatIcon"></div><p>'+temp.j+'</p></div><br>');
			//console.log("data: "+temp.response);
			count = count +1;		
			$("#msgBlock").val("");
			
			});
			
			//sleepFor(3000);
			//alert("fin");
			//window.open(temp.url);
		});
		
		$("#msgBlock").focus(function(e){
			$("#msgBlock").val("");
		});
		
		/*$("#msgBlock").blur(function(e){
			$("#msgBlock").val("Type your response");
		});*/
		
	});
	//mytitle.innerHTML = temp.response;
	

	
	

	

function parseJson(str){
	return window.JSON ? JSON.parse(str) : eval('(' + str + ')');
}
function prettyJson(str){
	// If browser does not have JSON utilities, just print the raw string value.
	return window.JSON ? JSON.stringify(JSON.parse(str), null, '  ') : str;
}
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing  } 
}
*/
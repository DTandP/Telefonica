var fs     = require('fs');
var express= require('express');
var app      = express();   
var watson = require('watson-developer-cloud');
var cors = require('cors');

app.use(cors());

var bodyParser = require('body-parser');    
var methodOverride = require('method-override'); 

var clientId=null;
var conversationId=null;
var profile = {};
var dialog_id='4c7808a0-1a7d-4cc3-a963-e9a5e6058455'; 
var name_values={};
   
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//dialog service initialisation

var dialog_service = watson.dialog({
  url: 'https://gateway.watsonplatform.net/dialog/api',
  username: '57704cd5-7b5c-473a-a785-fa3333fbcb15',
  password: 'jQgAjOjH4Wag',
  version: 'v1'
});

//NLC service initialisation


var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: '45d4055a-ad01-4136-824f-7b0014bfbb8c',
  password: 'Z7P5HJl8vIr0',
  version: 'v1'
});

//Api to begin conversation

  app.get('/api/WelcomeData', function(req, res) {

  

var params = {
   dialog_id: '4c7808a0-1a7d-4cc3-a963-e9a5e6058455' 
};


dialog_service.conversation(params, function(err, conversation) {
  if (err)
    console.log(err)
  else
  	{

 	clientId=conversation.client_id;
 	conversationId=conversation.conversation_id;
	console.log("Client Id is : "+clientId);
	console.log("Conversation id is : "+conversationId);
	}
});
    });

//Api to get response from NLC

  app.get('/api/nlcGetInitialData', function(req, res) {

var msgBlock=req.param('msg');
console.log(msgBlock);
console.log("Client Id out is : "+clientId);
	console.log("Conversation id out  is : "+conversationId);



natural_language_classifier.classify({
  text: msgBlock,
  classifier_id: '3a84d1x62-nlc-5248' },
 
  function(err, response) {
    if (err)
      console.log('error:', err);
    else{


profile["Class1"] = response.classes[0].class_name;
profile["Class1_Confidence"] = response.classes[0].confidence.toString();



var params2 = {
  dialog_id: '4c7808a0-1a7d-4cc3-a963-e9a5e6058455',
  client_id: clientId.toString(),
  name_values: [{
       name:'Class1',
       value:response.classes[0].class_name
     },
     {
       name:'Class1_Confidence',
       value:response.classes[0].confidence.toString()
     }]
};


dialog_service.updateProfile(params2, function(err, response){

	if (err)
	console.log(err)
	else

  {

    console.log("Done Updating");
    getDialogProfile();
 
  }

});
    }

});

//end of NLC's classify and dialog service's update function

function getDialogProfile(){
var params3 = {
  dialog_id: '4c7808a0-1a7d-4cc3-a963-e9a5e6058455',
  client_id: clientId.toString(),
  
};

//should be used if profile info is needed
dialog_service.getProfile(params3, function(err, response){
console.log(response);
doConverse();
});

}


function doConverse(){

var params4 = {
  conversation_id: conversationId.toString(),
  dialog_id: '4c7808a0-1a7d-4cc3-a963-e9a5e6058455',
  client_id: clientId.toString(),
  input:msgBlock
};

// Start of Dialog service's conversation function. Now converse with dialog service using converse function

setTimeout(function() { dialog_service.conversation(params4, function(err, conversation) {
  if (err)
    console.log(err)
  else
  	{
  		console.log("now conversing");
 	res.send(conversation.response[0])

 	}

});
	 }, 0);

}

// end of converse function
    });
 
//Application listening on port 6080

  app.listen(6080);
    console.log("Telefonica app listening on port 6080");
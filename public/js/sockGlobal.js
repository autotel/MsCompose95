var sockman={
	bindList:[]
}
//pendant: all the following should be inside socket namespace
//pendant: the object itself changes from the action of the user and also upon reception of the socket value; that is not efficient.
//socket should onl emiy to all the other users.
sockChange=function(subject,change,value){
  // console.log("sockChange was not initialized");
};
stringToObject=function(whos){
	var ret=null;
	//whos=the string representing who I want to adress
  //this hardcoded line avoids hacking into the master's javascript
  whos=whos.split(/[\/\:]/g);
	ret=sockman.bindList;
	for(a=1;a<whos.length;a++){
    // console.log(ret);
		ret=ret[whos[a]];
	}
	return ret;
}
$(document).ready(function(){
	var socket = io();
	//this is here just for easier maintenance, maybe could be shortcutted.
  socket.on('areYouAlive',function(){
    socket.emit("imAlive");
  });
	function makeReceivedChange(data){
	    console.log("data io msg change");
			console.log(data);
	    //we will apply actions to the object addressed by subject string.
	    //see sockChange(... on sequencerClass.js
	    object=stringToObject(data.subject);
	    if(data.change=="sV"){
				if(object.hasOwnProperty("setData")){
		      object.setData(data.val);
				}else{
					console.log("problem! object didnt have setData()",object);
				}
	    }
			if(data.change=="dspl"){
				if(object.hasOwnProperty("setDisplace")){
					object.setDisplace(data.val);
				}else{
					console.log("problem! object didnt have setDisplace()",object);
				}
			}
			// if(data.change=="stpoint"){
			// 	if(object.hasOwnProperty("setDisplace")){
			// 		object.setDisplace(data.val);
			// 	}else{
			// 		console.log("problem! object didnt have setDisplace()",object);
			// 	}
			// }
			// if(data.change=="enpoint"){
			// 	if(object.hasOwnProperty("setDisplace")){
			// 		object.setDisplace(data.val);
			// 	}else{
			// 		console.log("problem! object didnt have setDisplace()",object);
			// 	}
			// }
	}
  socket.on('change', makeReceivedChange);
  // socket.on('helloUser', function(msg){
  //   //if user device goes to sleep and comes back, sequencers will accumulate through sessions, unless...
  //   for(s in seqs){
  //     seqs[s].die();
  //   }
  //   console.log("Hello user.");
  //   console.log(msg);
  // });
  // socket.on('newSequencer', function(msg){
  //   console.log("Add sequencer "+msg.index);
  //   console.log(msg);
  //   seqProg=msg.seqProg;
  //   seqs[msg.index]=new Sequencer(msg.index,msg.seqProg);
  // });

  socket.on('helloMaster', function(msg){

    sockChange=function(subject,change,value){
      console.log("sockchange");
      socket.emit('change',{change:change,subject:subject,val:value});
    };
		for(sub in msg){
			console.log(msg[sub]);
			makeReceivedChange(msg[sub]);
		}
    console.log("hello master");
		console.log(msg);
    // socket.on('userEntered',function(loggingSocket){
    //   var tseqs=[];
    //   for(a=0;a<4;a++){
    //     tseqs.push(giveUserASequencer());
    //     console.log("user socket "+loggingSocket+" connected. giving id & sequencer n° "+tseqs[a].index);
    //   }
    //   socket.emit('newSequencerCreated',{loggingSocket:loggingSocket,sequencers:tseqs});
    // });
    // socket.on('userLeft', function(number){
    //   console.log('client with sequencer '+number+' disconnected');
    //   //pendiente: when user leaves, remove squencer. it is tricky due to c
    //   //arrays changing sizes everywhere
		//
    //   seqs[number].die();
    // });
    socket.on('ipAddress',function(addr){
      $("#ipAddress").html("type:"+addr.address+" or scan:");
      $('#qrcode').qrcode({text:addr.address});
    });
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});
});
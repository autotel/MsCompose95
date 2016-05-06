sockChange=function(subject,change,value){
  console.log("sockChange was not initialized");
};
stringToObject=function(whos){
	var ret=null;
	//whos=the string representing who I want to adress
  //this hardcoded line avoids hacking into the master's javascript
  whos=whos.split(/[\/\:]/g);
  if(whos[0]=="seqs"){
		ret=seqs;
		//console.log("brocmove")
	}

	for(a=1;a<whos.length;a++){
    console.log(ret);
		ret=ret[whos[a]];
	}
	return ret;
}
$(document).ready(function(){
	var socket = io();
	//this is here just for easier maintenance, maybe could be shortcutted.
	sockChange=function(subject,change,value){
    console.log("sockchange");
		socket.emit('change',{change:change,subject:subject,val:value});
	}

  socket.on('areYouAlive',function(){
    socket.emit("imAlive");
  });
  socket.on('change', function(data){
    console.log("data io msg change");
		console.log(data);
    //we will apply actions to the object addressed by subject string.
    //see sockChange(... on sequencerClass.js
    object=stringToObject(data.subject);
    if(data.change=="sV"){
      object.setData(data.val);
    }
  });
  socket.on('helloUser', function(msg){
    //if user device goes to sleep and comes back, sequencers will accumulate through sessions, unless...
    for(s in seqs){
      seqs[s].die();
    }
    console.log("Hello user. Add sequencer");
    console.log(msg);
    seqProg=msg.seqProg;
    seqs[msg.index]=new Sequencer(msg.index,msg.seqProg);
  });
  socket.on('helloMaster', function(msg){
    console.log("hello master");
		console.log(msg);
    socket.on('userEntered',function(loggingSocket){
      var seqNo=giveUserASequencer();
      console.log("user socket "+loggingSocket+" connected. giving id & sequencer n° "+seqNo.index);
      socket.emit('newSequencerCreated',{loggingSocket:loggingSocket,sequencer:seqNo});
    });
    socket.on('userLeft', function(number){
      console.log('client with sequencer '+number+' disconnected');
      //pendiente: when user leaves, remove squencer. it is tricky due to c
      //arrays changing sizes everywhere

      seqs[number].die();
    });
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});
});
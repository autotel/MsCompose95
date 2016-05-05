
var sMaster={};
var sClients={};
var dataTracker={seqs:[]};
var express = require('express');

sMaster.app=express();
sClients.app=express();
sMaster.http = require('http').Server(sMaster.app);
sClients.http = require('http').Server(sClients.app);
sMaster.io = require('socket.io')(sMaster.http);
sClients.io = require('socket.io')(sClients.http);

sMaster.app.get('/', function(req, res){
  sMaster.app.use(express.static('public'));
  res.sendFile(__dirname + '/public/masteruser.html');
});
sClients.app.get('/', function(req, res){
  sClients.app.use(express.static('public'));
  res.sendFile(__dirname + '/public/user.html');
});
sMaster.http.listen(3000, function(){
  console.log('listening on *:3000');
});

sClients.http.listen(80, function(){
  console.log('listening on *:80');
});

sMaster.io.on('connection', function(socket){
  //on hello, the master will create a new sequencer and respond with the index number.
  //the index number is taken by the user to configure the sequencer
  console.log('a master connected');
  //maybe the socket server is the one that rules the sequencer ids...
  //or rather not...
  socket.emit('helloMaster',"nothing");
  socket.on('newSequencerCreated',function(data){
    //this code particularizes a single socket
    //otherwise, every client gets the helloUser.
    //it is in array because is called outside the socket event of clients
    sClients.sockets[data.loggingSocket].emit('helloUser',data.sequencer);
    sClients.sockets[data.loggingSocket].sequencer=data.sequencer;
    dataTracker.seqs[data.sequencer.index]=data.sequencer;
    console.log("created sequencer index pos: "+data.loggingSocket+"sequencer: "+data.sequencer.index);
  });
  socket.on('disconnect', function(){
    console.log('master disconnected');
  });

  socket.on('change', function(data){
    console.log(data);
    //cross connections... maybe there is a more elegant solution to this
    sMaster.io.emit('change',data);
    sClients.io.emit('change',data);
  });
});
sClients.sockets=[];
sClients.io.on('connection', function(socket){
  socket.arrayIndex=sClients.sockets.length;
  console.log('a client '+socket.arrayIndex+' connected');
  sClients.sockets.push(socket);
  sMaster.io.emit('userEntered',socket.arrayIndex);
  socket.on('disconnect', function(number){
    console.log(number);
    console.log('client '+socket.arrayIndex+' seq num '+sClients.sockets[socket.arrayIndex].sequencer.index+' disconnected');
    // sClients.sockets.splice(socket.arrayIndex,1);
    // dataTracker.seqs.splice(number,1);
    sMaster.io.emit('userLeft',sClients.sockets[socket.arrayIndex].sequencer.index);
  });

  socket.on('change', function(data){
    console.log(data);
    //cross connections... maybe there is a more elegant solution to this
    sClients.io.emit('change',data);
    sMaster.io.emit('change',data);
  });
});

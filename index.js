
var sMaster={};
var sClients={};
var dataTracker={seqs:[]};
var express = require('express');
var masterport=8080;
var clientport=80;
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
sMaster.http.listen(masterport, function(){
  console.log('listening on *:'+masterport);
});

sClients.http.listen(clientport, function(){
  console.log('listening on *:'+clientport);
});

sMaster.io.on('connection', function(socket){
  //on hello, the master will create a new sequencer and respond with the index number.
  //the index number is taken by the user to configure the sequencer
  console.log('a master connected');
  //maybe the socket server is the one that rules the sequencer ids...
  //or rather not...
  socket.emit('helloMaster',"nothing");
  ipname={address:"http://autotel.co/collab95"};
  socket.emit('ipAddress',ipname);


  socket.on('newSequencerCreated',function(data){
    //this code particularizes a single socket
    //otherwise, every client gets the helloUser.
    //it is in array because is called outside the socket event of clients
    sClients.sockets[data.loggingSocket].emit('helloUser');
    for(itm in data.sequencers){
      sClients.sockets[data.loggingSocket].emit('newSequencer',data.sequencers[itm]);
      dataTracker.seqs[data.sequencers[itm].index]=data.sequencers;
      console.log("created sequencer socket index: "+data.loggingSocket+"sequencer: "+data.sequencers[itm].index);
    }
    sClients.sockets[data.loggingSocket].sequencers=data.sequencers;
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
  socket.timeout=setInterval(function(){
    if(socket.expectingMessage){
      console.log("Socket "+socket.arrayIndex+"no longer alive. disconnected");
      socket.disconnect();
      socket.expectingMessage=true;
    }else{
      socket.emit("areYouAlive");
      // console.log("emitted areYouAlive to "+socket.arrayIndex);
    }
  },30*1000);
  socket.on('imAlive',function(){
    // console.log("Socket "+socket.arrayIndex+" is still alive");
    socket.expectingMessage=false;
  });
  socket.arrayIndex=sClients.sockets.length;
  console.log('a client '+socket.arrayIndex+' connected');
  sClients.sockets.push(socket);
  sMaster.io.emit('userEntered',socket.arrayIndex);
  socket.on('disconnect', function(number){
    console.log(number);
    // sClients.sockets.splice(socket.arrayIndex,1);
    // dataTracker.seqs.splice(number,1);
    var thisSocket=sClients.sockets[socket.arrayIndex];
    for(itm in thisSocket.sequencers){
      console.log('client '+(socket.arrayIndex||-1)+' seq num '+(thisSocket.sequencers[itm].index||-1)+' disconnected');
      sMaster.io.emit('userLeft',thisSocket.sequencers[itm].index);
    }
  });

  socket.on('change', function(data){
    console.log(data);
    //cross connections... maybe there is a more elegant solution to this
    sClients.io.emit('change',data);
    sMaster.io.emit('change',data);
  });
});

//get ip, from http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var ipname={name:"error",address:"error"};
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
      // sMaster.io.emit('ipAddress',ifname + ':' + alias, iface.address);
      // ipname=ifname + ':' + alias, iface.address;
      ipname={name:ifname+":"+alias,address:iface.address};
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      // sMaster.io.emit('ipAddress',ifname, iface.address);
      ipname={name:ifname,address:iface.address};
    }
    ++alias;
  });
});

// en0 192.168.1.101
// eth0 10.0.0.101
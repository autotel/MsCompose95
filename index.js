var sMaster={};
var dataTracker={};
var express = require('express');
var masterport=80;


sMaster.app=express();
sMaster.http = require('http').Server(sMaster.app);
sMaster.io = require('socket.io')(sMaster.http);

sMaster.app.get('/', function(req, res){
  sMaster.app.use(express.static('public'));
  res.sendFile(__dirname + '/public/index.html');
});

sMaster.http.listen(masterport, function(){
  console.log('listening on *:'+masterport);
});


sMaster.io.on('connection', function(socket){
  //on hello, the master will create a new sequencer and respond with the index number.
  //the index number is taken by the user to configure the sequencer
  console.log('a master connected');
  //maybe the socket server is the one that rules the sequencer ids...
  //or rather not...
  console.log(dataTracker);
  socket.emit('helloMaster',dataTracker);
  // ipname={address:"http://autotel.co/collab95"};
  // socket.emit('ipAddress',ipname);
  socket.on('newSequencerCreated',function(data){
    sClients.sockets[data.loggingSocket].sequencers=data.sequencers;
  });
  socket.on('disconnect', function(){
    console.log('master disconnected');
  });

  socket.on('change', function(data){
    console.log(data);
    //cross connections... maybe there is a more elegant solution to this
    sMaster.io.emit('change',data);
    //pendant: should be socket.emit
    dataTracker[data.subject]=data;
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
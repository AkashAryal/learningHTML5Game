const express = require('express')
const app = express()
const serv = require('http').Server(app);
const Player = require('./server/Player.js');
app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'))
app.use('/client', express.static(__dirname + '/client'))
serv.listen(2000);

var SOCKET_LIST = {};
//var PLAYER_LIST={};

var io = require('socket.io')(serv,{});
//this initializes connection and recieves client data
//RECIEVES FROM CLIENT
io.sockets.on('connection', function (socket){
  socket.id=Math.random();
  SOCKET_LIST[socket.id]=socket;
  //var player = new Player(socket.id);
  //PLAYER_LIST[socket.id]=player;
  Player.onConnect(socket);

  socket.on('disconnect',()=>{
    delete SOCKET_LIST[socket.id];
    //delete PLAYER_LIST[socket.id];
    Player.onDisconnect(socket);
    
  });

  /*socket.on('keyPress',(data)=>{ //change class var of Person to say button has been pressed
    if(data.inputID==='left')
      player.setPressingLeft(data.state);
    if(data.inputID==='right')
      player.setPressingRight(data.state)
    if(data.inputID==='up')
      player.setPressingUp(data.state);
    if(data.inputID==='down')
      player.setPressingDown(data.state);
  });*/
});

//this loop does all of the updating and communicating with client.
//COMMUNICATES WITH CLIENT
setInterval( ()=>{
  var pack =Player.update();
  /* var pack =[];
  for(var i in PLAYER_LIST){ //for each connection
    var player =  PLAYER_LIST[i];
    player.updatePosition();
    pack.push( //push data to pack arr
      player
    );
  } */
  for (var i in SOCKET_LIST) { //emit players info
    var socket =  SOCKET_LIST[i];
    //console.log(pack);
    
    socket.emit('newPosition',pack); //send pack data to client
  }
},1000/25);

require('dotenv').config()

const mongojs = require('mongojs');
const db_name = "myGame"
const db_conn = "localhost:27017/"+db_name; 
const db = mongojs(db_conn,['account','progress'])

const express = require('express')
const app = express()
const serv = require('http').Server(app);
const Player = require('./server/Player.js');
const Bullet = require('./server/Bullet.js');
require('./server/GodClass.js')();
app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'))
app.use('/client', express.static(__dirname + '/client'))
serv.listen(2000);

var SOCKET_LIST = {};
var USERS = {
  //username:password
  "bob": "asd",
  "bob2": "bob",
  "bob3": "ttt",
}
var initPack = { player: [], bullet: [] }
var removePack = { player: [], bullet: [] }

var tP = new Player(12132213,initPack,removePack);

var isValidPassword = function (data, cb) {
  db.account.find({username:data.username, password:data.password},(err,res)=>{
    if(res.length>0)
      cb(true);
    else
      cb(false);
  })
}

var isUsernameTaken = function (data, cb) {
  db.account.find({username: data.username}, (err, res) => {
    if (res.length > 0)
      cb(true);
    else
      cb(false);
  })
}
var addUser = function (data, cb) {
  db.account.insert({ username: data.username, password: data.password }, (err, res) => {
    cb();
  })
}
var io = require('socket.io')(serv, {});
//this initializes connection and recieves client data
//RECIEVES FROM CLIENT
io.sockets.on('connection', function (socket) {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn', (data) => {
    isValidPassword(data,(res)=>{
      if(res){
        Player.onConnect(socket, initPack, removePack); //includes onKeyPress
        socket.emit('signInResponse', { success: true })
      }else{
        socket.emit('signInResponse', { success: false })
      }
    });
  });

  socket.on('signUp', (data)=>{
    isUsernameTaken(data, (res)=>{
      if(res){
        socket.emit('signUpResponse', { success: false })
      }else{
        addUser(data,()=>{
          socket.emit('signUpResponse', { success: true });
        });
      }
    });
  });
  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id];
    //delete PLAYER_LIST[socket.id];
    Player.onDisconnect(socket);

  });

  socket.on('sendMsgToServer', (data) => {
    var playerName = ("" + socket.id).slice(2, 7);
    for (var i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data) //emit data to every connection
    }
  })

  socket.on('evalServer', (data) => {

    if (process.env.DEBUG == "true") {
      var res = eval(data)
      socket.emit('evalAnswer', res)
    } else {
      socket.emit('evalAnswer', data)
    }
  });

});

//this loop does all of the updating and communicating with client.
//COMMUNICATES WITH CLIENT
setInterval(() => {
  var pack = {
    player: Player.update(),
    bullet: Bullet.update(),
  }
  // var pack =Player.update();
  for (var i in SOCKET_LIST) { //emit players info
    var socket = SOCKET_LIST[i];
    socket.emit('update', pack); //send pack data to client
    socket.emit('init',initPack)
    socket.emit('remove',removePack)
  }
  clearPacks([initPack,removePack]);
}, 1000 / 25);

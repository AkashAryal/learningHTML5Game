(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Bullet_c{
    constructor(initPack) {
        this.id = initPack.id;
        this.x = initPack.x
        this.y = initPack.y
        Bullet_c.list[this.id] = this;
    }
}
Bullet_c.list = {};
module.exports = Bullet_c;
},{}],2:[function(require,module,exports){
class Player_c{
    constructor(initPack) {
      this.id =initPack.id;
      this.number = initPack.number;
      this.x=initPack.x
      this.y=initPack.y
      Player_c.list[this.id]=this;
    }

    getX(){
      return this.x;
    }
}
Player_c.list = {};
module.exports = Player_c;
},{}],3:[function(require,module,exports){
const Player_c=require('./Client_Classes/Player_c.js')
const Bullet_c = require('./Client_Classes/Bullet_c.js')
require('../../server/GodClass.js')();
var tttt = new Player_c({ x: "233",id:123,});
var t2 = new Player_c({id:"yo",x:23});

var t3 = new Player_c({id:"3rd",x:728});
var t4 = new Player_c({id:"4rd",x:7282});
/*
console.log(Player_c.list);
delete Player_c.list['yo'];
console.log(Player_c.list);
var initPack = {player:[tttt,t2], bullet:[t3,t4]};
var removePack = {bullet:[t3,t4], player:[tttt,t2]};
clearPacks([initPack,removePack]);
removePack.player=[tttt]
console.log(removePack);

console.log(initPack);*/

var socket = io();
//signin
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

signDivSignIn.onclick = function () {
    socket.emit('signIn', { username: signDivUsername.value, password: signDivPassword.value })
}

signDivSignUp.onclick = function () {
    socket.emit('signUp', { username: signDivUsername.value, password: signDivPassword.value });
}

socket.on('signUpResponse', (data) => {
    if (data.success) {
        alert("sign up successful")
    } else {
        alert("error sign up")
    }
})
socket.on('signInResponse', (data) => {
    if (data.success) {
        signDiv.style.display = 'none';
        gameDiv.style.display = 'inline-block';
    } else {
        alert("sign in error")
    }
});
//game
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');

var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';


socket.on('addToChat', (data) => {
    chatText.innerHTML += '<div>' + data + '</div>';
    chatText.scrollTop = chatText.scrollHeight - chatText.clientHeight; //keep scroll bar at btm
});

socket.on('evalAnswer', (data) => {
    console.log(data);
    //keep scroll bar at btm
});
chatForm.onsubmit = (e) => {
    e.preventDefault();
    if (chatInput.value[0] === '/') {
        socket.emit('evalServer', chatInput.value.slice(1));
        chatInput.value = "";
    } else if (chatInput.value != "") { //make sure something is written
        socket.emit('sendMsgToServer', chatInput.value);
        chatInput.value = "";
    }
}
//init -> only sent when new stuff is created.
socket.on('init', (data) => {
    for (var i = 0; i < data.player.length; i++) {
        new Player_c(data.player[i]);
    }
    for (var i = 0; i < data.bullet.length; i++) {
        new Bullet_c(data.bullet[i]);
    }
});
//update -> Sent every frame
socket.on('update',(data)=>{
    for (let i = 0; i < data.length; i++) {
        var serverPlayer = data.player[i];
        var clientPlayer = Player_c.list[serverPlayer.id]

        if (clientPlayer){ //if server player exists in client side
            if (serverPlayer.x !==undefined)
                clientPlayer.x = serverPlayer.x;
            if (serverPlayer.y !==undefined)
                clientPlayer.y= serverPlayer.y;
        }
    }
    for (let i = 0; i < data.length; i++) {
        var serverBullet = data.bullet[i];
        var clientBullet = Bullet_c.list[serverBullet.id]

        if (clientBullet){ //if server player exists in client side
            if (serverBullet.x !==undefined)
                clientBullet.x = serverBullet.x;
            if (serverBullet.y !==undefined)
                clientBullet.y= serverBullet.y;          
        }
    }
})
//remove -> sends id of thigs to remove
socket.on('remove',(data)=>{
    for (var i = 0; i < data.player.length; i++) {
        delete Player_c.list[data.player[i]];
    }
    for (var i = 0; i < data.bullet.length; i++) {
        delete Bullet_c.list[data.bullet[i]];
    }
})

/*socket.on('newPosition', (data) => {
    ctx.clearRect(0, 0, 500, 500);
    for (var i = 0; i < data.player.length; i++) {
        ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y)
    }
    for (var i = 0; i < data.bullet.length; i++) {
        ctx.fillRect(data.bullet[i].x - 5, data.bullet[i].y - 5, 10, 10)
    }
})*/

setInterval(() => {
    ctx.clearRect(0, 0, 500, 500);
    for (var i in Player_c.list) {
        ctx.fillText(Player_c.list[i].number, Player_c.list[i].x, Player_c.list[i].y)
    }
    for (var i in Bullet_c.list) {
        ctx.fillRect(data.bullet[i].x - 5, data.bullet[i].y - 5, 10, 10)
    }
}, 40);

document.onkeydown = (event) => {
    if (event.keyCode === 68) { //d
        socket.emit('keyPress', { inputID: 'right', state: true }); console.log("e");
    }
    else if (event.keyCode === 83) //s
        socket.emit('keyPress', { inputID: 'down', state: true });
    else if (event.keyCode === 65) //a
        socket.emit('keyPress', { inputID: 'left', state: true });
    else if (event.keyCode === 87) //w
        socket.emit('keyPress', { inputID: 'up', state: true });
}

document.onmousedown = (event) => {
    socket.emit('keyPress', { inputID: 'attack', state: true })
}
document.onmouseup = (event) => {
    socket.emit('keyPress', { inputID: 'attack', state: false })
}
document.onmousemove = (event) => {
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.atan2(y, x) / Math.PI * 180

    socket.emit('keyPress', { inputID: 'mouseAngle', state: angle })
}


document.onkeyup = (event) => {
    if (event.keyCode === 68) //d
        socket.emit('keyPress', { inputID: 'right', state: false });
    else if (event.keyCode === 83) //s
        socket.emit('keyPress', { inputID: 'down', state: false });
    else if (event.keyCode === 65) //a
        socket.emit('keyPress', { inputID: 'left', state: false });
    else if (event.keyCode === 87) //w
        socket.emit('keyPress', { inputID: 'up', state: false });
}

},{"../../server/GodClass.js":4,"./Client_Classes/Bullet_c.js":1,"./Client_Classes/Player_c.js":2}],4:[function(require,module,exports){
module.exports = function () {
    /**
     * resets packs to empty
     */
    this.clearPacks =  (arr) =>{ //   [ init:{[],bullet[]} , remove:{player[],bullet[]} ]
     for (let i = 0; i < arr.length; i++) {
         const pack = arr[i];
         
         for (const inst in pack) {
             if (pack.hasOwnProperty(inst)) {
                 const element = pack[inst];
                 pack[inst]=[];
             }
         }
         
     }
    };
}
},{}]},{},[3]);

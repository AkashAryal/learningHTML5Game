const Player_c=require('./Client_Classes/Player_c.js')

var tttt = new Player_c("jdsdjk");
console.log(tttt);

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
        new Player_c
    }

})
//update -> new stuff. Sent every frame

//remove -> sends id of thigs to remove


socket.on('newPosition', (data) => {
    ctx.clearRect(0, 0, 500, 500);
    for (var i = 0; i < data.player.length; i++) {
        ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y)
    }
    for (var i = 0; i < data.bullet.length; i++) {
        ctx.fillRect(data.bullet[i].x - 5, data.bullet[i].y - 5, 10, 10)
    }
})

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

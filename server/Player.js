'use strict';
const Entity = require('./Entity');

class Player extends Entity {
  constructor(id) {
    /*this.x = 250;
    this.y = 250;
    */
   super();
    this.id = id;
    
    this.number = "" + Math.floor(10 * Math.random());
    this.pressingDown = false;
    this.pressingUp = false;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.maxSpd = 10;
    Player.list[this.id]=this;
  }

  /*updatePosition() {
    if (this.pressingDown)
      this.y += this.maxSpd;
    if (this.pressingUp)
      this.y -= this.maxSpd;
    if (this.pressingLeft)
      this.x -= this.maxSpd;
    if (this.pressingRight)
      this.x += this.maxSpd;
  }*/
  static onConnect(socket){
    var player = new Player(socket.id);
    socket.on('keyPress', (data) => { //change class var of Person to say button has been pressed
      if (data.inputID === 'left')
        player.setPressingLeft(data.state);
      if (data.inputID === 'right')
        player.setPressingRight(data.state)
      if (data.inputID === 'up')
        player.setPressingUp(data.state);
      if (data.inputID === 'down')
        player.setPressingDown(data.state);
    });
  }

  static onDisconnect(socket){
    delete Player.list[socket.id];
  }

  static update(){
    var pack = [];
    for (var i in Player.list) { //for each connection
      var player = Player.list[i];
      player.update();
      pack.push( //push data to pack arr
        player
      );
    } 
      return pack;
  }
  updateSpd(){
    if (this.pressingDown)
      this.spdY = this.maxSpd;
    else if (this.pressingUp)
      this.spdY = -this.maxSpd;
    else
      this.spdY=0;

    if (this.pressingRight)
      this.spdX = this.maxSpd;
    else if(this.pressingLeft)
      this.spdX = -this.maxSpd;
    else
      this.spdX=0;
  }

  update(){
    this.updateSpd();
    super.update();
  }

  setPressingDown(boolean) {
    this.pressingDown = boolean;
  }
  setPressingUp(boolean) {
    this.pressingUp = boolean;
  }
  setPressingRight(boolean) {
    this.pressingRight = boolean;
  }
  setPressingLeft(boolean) {
    this.pressingLeft = boolean;
  }

  getPressingLeft() {
    return this.pressingLeft;
  }
  getPressingRight() {
    return this.pressingRight;
  }
  getPressingUp() {
    return this.pressingUp;
  }
  getPressingDown() {
    return this.pressingDown;
  }
  getNumber() {
    return this.number;
  }
  getMaxSpd() {
    return this.maxSpd;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
}
Player.list = {};
module.exports = Player;
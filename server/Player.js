'use strict';
const Entity = require('./Entity');
const Bullet = require('./Bullet');

class Player extends Entity {
  constructor(id) {
    super();
    this.id = id;
    
    this.number = "" + Math.floor(10 * Math.random());
    this.pressingDown = false;
    this.pressingUp = false;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.maxSpd = 10;
    this.pressingAttack=false;
    this.mouseAngle=0;
    Player.list[this.id]=this;
    initPack.Player.push({
      id:this.id,
      x:this.x,
      y:this.y
    });
  }

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
      if (data.inputID === 'attack'){
        player.setPressingAttack(data.state);
        }
      if (data.inputID === 'mouseAngle')
        player.setMouseAngle(data.state);
    });
  }

  static getList(){
    return Player.list;
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
  /**
   * updates x and y speds
   */
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

  shootBullet(angle) {
    var bullet = new Bullet(angle,this.id)
    bullet.x = this.x;
    bullet.y = this.y;
  }
  /**
   * Calls update() and Entity's update()
   * 
   * @param none
   */
  update(){
    this.updateSpd();
    super.update();

    if(this.pressingAttack){
      this.shootBullet(this.mouseAngle);
    }

  }

  getId(){
    return this.id;
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
  setPressingAttack(boolean) {
    this.pressingAttack = boolean;
  }
  setMouseAngle(angle) {
    this.mouseAngle = angle;
  }
}
Player.list = {};
module.exports = Player;
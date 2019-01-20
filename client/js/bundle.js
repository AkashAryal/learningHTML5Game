(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Player=require('./player.js')
},{"./player.js":2}],2:[function(require,module,exports){
'use strict';

module.exports = class Player {
   constructor(id) {
       this.x = 250;
       this.y=250;
       this.id=id;
       this.number= "" +Math.floor(10*Math.random());
       this.pressingDown=false;
       this.pressingUp=false;
       this.pressingLeft=false;
       this.pressingRight=false;
       this.maxSpd=10;
   }

   updatePosition(){
     if(this.pressingDown)
      this.y +=this.maxSpd;
     if(this.pressingUp)
      this.y +=this.maxSpd;
     if(this.pressingLeft)
      this.x +=this.maxSpd;
     if(this.pressingRight)
      this.x +=this.maxSpd;
   }

   setPressingDown(boolean){
     this.pressingDown=boolean;
   }
   setPressingUp(boolean){
     this.pressingUp=boolean;
   }
   setPressingRight(boolean){
     this.pressingRight=boolean;
   }
   setPressingLeft(boolean){
     this.pressingLeft=boolean;
   }

   getPressingLeft(){
     return this.pressingLeft;
   }
   getPressingRight(){
     return this.pressingRight;
   }
   getPressingUp(){
     return this.pressingUp;
   }
   getPressingDown(){
     return this.pressingDown;
   }
   getNumber(){
     return this.number;
   }
   getMaxSpd(){
     return this.maxSpd;
   }
   getX(){
     return this.x;
   }
   getY(){
     return this.y;
   }
}

},{}]},{},[1]);

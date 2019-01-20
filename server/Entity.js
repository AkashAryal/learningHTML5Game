/*
    Basic stuff every "thing" in a ga,e has
*/
module.exports = class Entity{

    constructor(){
     this.x = 250;
     this.y=250;
     this.spdX=0;
     this.spdY=0;
     this.id="";
    }

    update(){
        this.updatePosition();
    }

    updatePosition(){
        this.x+=this.spdX;
        this.y+=this.spdY;
    }
}


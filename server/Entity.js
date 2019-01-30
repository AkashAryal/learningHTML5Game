/*
    Basic stuff every "thing" in a ga,e has
*/
module.exports = class Entity{
    
    /**
     * x,y,spdX,spdY,id
     */
    constructor(){
     this.x = 250;
     this.y=250;
     this.spdX=0;
     this.spdY=0;
     this.id="";
    }
    
    /**
     * calls method to update position
     *
     */
    update(){
        this.updatePosition();
    }

    updatePosition(){
        this.x+=this.spdX;
        this.y+=this.spdY;
    }

    getDistance(point){
        return Math.sqrt(Math.pow(this.x-point.x,2) + Math.pow(this.y-point.y,2))
    }
}


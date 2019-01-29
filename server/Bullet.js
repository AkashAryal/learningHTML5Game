'use strict';
const Entity = require('./Entity');


class Bullet extends Entity {

            //in rads?, id of parent
    constructor(angle, parent) {
        super();
        this.id = Math.random();
        this.spdX = Math.cos(angle / 180 * Math.PI) * 10
        this.spdY = Math.sin(angle / 180 * Math.PI) * 10
        this.timer = 0;
        this.toRemove = false;
        this.parent=parent;
        Bullet.list[this.id] = this;
    }

    //main update
    update() {
        if (this.timer++ > 100)
            this.toRemove = true;
        super.update();
        const Player = require('./Player'); //only works if this is here

        var list = Player.list;
        for (var i in list) {
            var p = list[i];
            if (super.getDistance(p) < 32 && this.parent !== p.getId()) {
                //handle collision EX: hp--
                this.toRemove=true;
            }
        }
    }

    static update() {
        var pack = [];
        for (var i in Bullet.list) { //for each connection
            var bullet = Bullet.list[i];
            bullet.update();
            if(bullet.toRemove==true)
                delete Bullet.list[bullet.id]   
            pack.push( //push data to pack arr
                bullet
            );
        }
        return pack;
    }
}
Bullet.list = {};
module.exports = Bullet;
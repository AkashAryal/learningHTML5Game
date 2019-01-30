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
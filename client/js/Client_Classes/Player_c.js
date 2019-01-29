class Player_c{
    constructor(initPack) {
      this.id =initPack.id;
      this.number = initPack.number;
      this.x=initPack.x
      this.y=initPack.y
      Player_c.list[this.id]=this;
    }
}
Player_c.list = {};
module.exports = Player_c;
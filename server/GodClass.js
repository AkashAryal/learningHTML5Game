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
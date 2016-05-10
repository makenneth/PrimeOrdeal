var Bubble = require('./bubble.js');
var Game = function(ctx){
  this.ctx = ctx;
  this.grid = Array.from(Array(8), function(spot){
    return Array.from(Array(10));
  }); //subarrays are columns
  this.bubbles = [];
  this.primes= [2, 3, 5, 7, 11,
                13, 17, 19, 23, 
                29, 31, 33, 37, 41, 
                43, 47, 53, 59, 61, 
                67, 71];
  this.rowSums = Array.from(Array(8), function(_){return 0;});
  this.colSums = Array.from(Array(10), function(_){return 0;});
  this.timeElapsed = 0;
  this.currentBubble = this.addBubble();
  $(document).on("keydown", this.updatePosition.bind(this));
  setInterval(this.incrementTime.bind(this), 10)
};

Game.prototype.incrementTime = function(){
  this.timeElapsed++;
};

Game.prototype.updatePosition = function(e){
  this.currentBubble.moveX(e.which);
};

Game.prototype.addBubble = function(){
  var speed = this.timeElapsed / 3000 + 1,
      randomNum = Math.ceil(Math.random() * 6 + 1),
      xPos = Math.floor(Math.random() * 8), //(canvas size/6) (offset for 40 pixel) (30 for radius)
      newBubble = new Bubble(this.ctx, xPos, speed, randomNum);
  this.bubbles.push(newBubble);
  return newBubble;
};

Game.prototype.moveBubble = function(){
  var bubbleCol = this.currentBubble.col,
      currentCol = this.grid[this.currentBubble.col];
  numOfBubblesInCol = currentCol.reduce(function(a, b){
                                    return a + (!!b ? 1 : 0);
                                  }, 0);
  if (this.currentBubble.pos_y >= (750 - (numOfBubblesInCol * 60 + 30 + 30))){ 
    this.grid[bubbleCol][numOfBubblesInCol] = this.currentBubble;
    this.colSums[bubbleCol] += this.currentBubble.value; 
    this.currentBubble = this.addBubble();
    this.clearPrimeRow();
    this.clearPrimeCol();
    console.log(this.colSums.join(", "));
  } else {
    this.currentBubble.fall();
  }
};

Game.prototype.draw = function(){
  this.ctx.clearRect(0, 0, 560, 800);
  this.ctx.fillStyle = "black"
  this.bubbles.forEach(function(bubble){
      bubble.draw(); 
  });
};

Game.prototype.move = function(){
  this.moveBubble();
};

Game.prototype.clearPrimeRow = function(){
  for (var i = 0; i < this.rowSums.length; i++){

    if (this.primes.indexOf(this.rowSums[i]) > -1){
      for (var k = 0; k < this.grid.length; k++){
        var idx = this.bubbles.findIndex(function(bubble){
          return bubble.isEqual(this.grid[k][i]);
        }.bind(this));

        if (idx >= 0) this.bubbles.splice(idx, 1);
        this.grid[k][i] = undefined;

        
        if (typeof this.grid[k + 1][i] === 'undefined') break;
      }
    }
  }
}
Game.prototype.clearPrimeCol = function(){
  for (var j = 0; j < this.colSums.length; j++){

    if (this.primes.indexOf(this.colSums[j]) > -1){
      for (var m = 0; m < this.grid[j].length; m++){
        var idx = this.bubbles.findIndex(function(bubble){
          return bubble.isEqual(this.grid[j][m]);
        }.bind(this));

        if (idx >= 0){
          this.bubbles.splice(idx, 1);
        }

        this.grid[j][m] = undefined;
        this.colSums[j] = 0;
      }
    }
  }
};

Game.prototype.lost = function(){
  if (this.grid.every(function(col){
    return col.every(function(cell){ 
      return !!cell;
    })
  })){
    return true;
  }
  return false;
};

module.exports = Game;
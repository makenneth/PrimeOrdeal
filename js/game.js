var Bubble = require('./bubble.js');
var Game = function(ctx){
  var startTime = Date.now();
  this.ctx = ctx;
  this.grid = Array.from(Array(8), function(spot){
    return Array.from(Array(10));
  }); //subarrays are columns
  this.bubbles = [];
  this.primes= [2, 3, 5, 7, 9, 11, 13, 17, 19, 23, 29, 31, 33, 37];
  this.rowSums = Array.from(Array(8));
  this.colSums = Array.from(Array(10));
  this.timeElapsed = startTime - Date.now();
  this.addBubble();
  $(document).on("keydown", this.updatePosition);
};

Game.updatePosition = function(e){
  this.currentBubble.moveX(e.which);
};

Game.prototype.addBubble = function(){
  var speed = this.timeElapsed / 30000 + 1,
      randomNum = Math.ceil(Math.random() * 6 + 1),
      xPos = Math.floor(Math.random() * 8), //(canvas size/6) (offset for 40 pixel) (30 for radius)
      newBubble = new Bubble(this.ctx, xPos, speed, randomNum);
  this.currentBubble = newBubble;
  this.bubbles.push(newBubble);
};

Game.prototype.moveBubble = function(){
  var bubbleCol = this.currentBubble.col,
      currentCol = this.grid[this.currentBubble.col];

  if (this.currentBubble.pos_y >= (this.grid[this.currentBubble.col].length * 60 + 30 + 30)){ 
    this.currentBubble.speed = 0;
    this.bubbles
    this.addBubble();
  } else {
    this.currentBubble.fall();
  }
};

Game.prototype.draw = function(){
  this.ctx.clearRect(0, 0, 560, 800);
  this.bubbles.forEach(function(bubble){
      bubble.draw(); 
  });
  this.clearPrime();
};
Game.prototype.move = function(){
  this.moveBubble();
};

Game.prototype.clearPrime = function(){
  for (var i = 0; i < this.rowSums; i++){
    if (this.primes.indexOf(this.rowSums[i]) > -1){
      for (var k = 0; k < this.grid.length; k++){
        this.grid[k][i] = undefined;
      }
    }
  }
  for (var j = 0; j < this.colSums; j++){
    if (this.primes.indexOf(this.colSums[j] > -1)){
      this.grid[j].map(function(cell){
        return undefined;
      });
    }
  }
  this.shiftBubbles();
};

Game.prototype.shiftBubbles = function(){

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
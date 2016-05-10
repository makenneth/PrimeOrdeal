var Bubble = require('./bubble.js');
var Game = function(ctx){
  this.ctx = ctx;
  this.grid = Array.from(Array(8), function(spot){
    return Array.from(Array(10));
  }); 
  this.bubbles = [];
  this.primes = [2, 3, 5, 7, 11,
                13, 17, 19, 23, 
                29, 31, 33, 37, 41, 
                43, 47, 53, 59, 61, 
                67, 71];
  
  this.colSums = Array.from(Array(8), function(_){return 0;});
  this.timeElapsed = 0;
  this.turns = 0; //every 7 turns, new balls will drop
  this.score = 0;
  this.dropHiddenBubbles();
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
      randomNum = (Math.random() * 7) <= 6 ? Math.ceil(Math.random() * 5 + 1) : 7,
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
    this.turns++;
    // this.clearPrimeRow();
    // .indexOf() in the column and determine whether or not they equal those pos
    this.clearPrimeCol();
    console.log(this.colSums.join(", "));
  } else {
    this.currentBubble.fall(); //check every bubble if they're where they're supposed to be
  }

  for (var i = 0; i < this.grid.length; i++){
    var currentCol = this.grid[i];
    if (currentCol.every(function(cell){return !cell;})) continue;
    for (var j = 0; j < currentCol.length; j++){
      if (!currentCol[j]) continue;
      var currentBubble = currentCol[j];
      if (currentBubble.pos_y < (750 - (j * 60 + 30 + 30))){
          currentBubble.fall();
      } else if (currentBubble.pos_y >  (750 - (j * 60 + 60))){  
        currentBubble.pos_y = 750 - (j * 60 + 60);
      }
    }
  }
};

Game.prototype.dropHiddenBubbles = function(){
  this.grid.forEach(function(col, idx){
    var randomNum = (Math.random() * 7) <= 6 ? Math.ceil(Math.random() * 5 + 1) : 7;
    var newBubble = new Bubble(this.ctx, idx, 10, randomNum, true, true);
    col[col.indexOf(undefined)] = newBubble;//index of looks for the first item that is undefined
    this.bubbles.push(newBubble);
  }.bind(this));
};


Game.prototype.draw = function(){
  this.ctx.clearRect(0, 0, 640, 800);
  this.ctx.font = "36px Arial";
  this.ctx.fillStyle = "black";
  this.ctx.fillText("PrimeOrdeal", 40, 60);
  this.ctx.font = "24px Arial";
  this.ctx.fillStyle = "black";
  this.ctx.fillText("Score", 24, 280);
  this.ctx.font = "24px Arial";
  this.ctx.fillStyle = "black";
  this.ctx.fillText(this.score, 44, 320);
  this.ctx.font = "20px Arial";
  this.ctx.fillStyle = "black";
  this.ctx.fillText("Turns Left", 14, 520);
  this.ctx.font = "24px Arial";
  this.ctx.fillStyle = "black";
  this.ctx.fillText(7 -this.turns, 44, 560);
  this.ctx.beginPath();
  this.ctx.lineWidth = 4;
  this.ctx.moveTo(118, 80);
  this.ctx.lineTo(118, 722);
  this.ctx.lineTo(602, 722);
  this.ctx.lineTo(602, 80);
  this.ctx.strokeStyle = "black";
  this.ctx.stroke();
  this.ctx.lineWidth = 2;
  this.ctx.fillStyle = "black";
  if (this.turns === 7){
    this.turns = 0;
    this.dropHiddenBubbles();
  }
  this.bubbles.forEach(function(bubble){
      bubble.draw(); 
  });
};

Game.prototype.clearPrimeRow = function(){
  for (var i = 0; i < this.grid[0].length; i++){
    var rangesToDelete = [], currentSum = 0,
        startPoint = 0;
    for (var j = 0; j < this.grid.length; j++){
      if (typeof this.grid[j][i] === "undefined") continue;
      currentSum += this.grid[j][i].value;
      if (j === (this.grid.length - 1) || typeof this.grid[j + 1][i] === "undefined"){
        if (this.primes.indexOf(currentSum) > -1){
          rangesToDelete.push([startPoint, j]);
        }
        startPoint = j;
        currentSum = 0;        
      }
    }
    this.deleteBubblesInRow(i, rangesToDelete);
  }

};

Game.prototype.deleteBubblesInRow = function(row, ranges){
  var toClear = [];
  for (var i = 0; i < ranges.length; i++){
    for (var j = ranges[i][0]; j <= ranges[i][1]; j++){
      var idx = this.bubbles.findIndex(function(bubble){
        return bubble.isEqual(this.grid[j][row])
      }.bind(this));   
      if (idx > -1){
        this.colSums[this.bubbles[idx].col] -= this.bubbles[idx].value;
        this.bubbles.splice(idx, 1);
      }
    // toClear.push([j, idx]);
    }
    // if (i === (range.length - 1) this.clearPrimeCol(toClear));
  }
};  

Game.prototype.clearPrimeCol = function(){
  for (var j = 0; j < this.colSums.length; j++){

    if (this.primes.indexOf(this.colSums[j]) > -1 && 
          this.grid[j].reduce(function(a,b){
            return a + (!!b ? 1 : 0);
          },0) > 2){
      for (var m = 0; m < this.grid[j].length; m++){
         this.clearBubblesInCol(j, m);
      }
    }
  }
};

Game.prototype.clearBubblesInCol = function(col, row){
    var idx = this.bubbles.findIndex(function(bubble){
      return bubble.isEqual(this.grid[col][row]);
    }.bind(this));
    if (idx >= 0){
      this.bubbles.splice(idx, 1);
    }
    this.grid[col][row] = undefined;
    this.colSums[col] = 0;
};

Game.prototype.lost = function(){

  if (this.grid.some(function(col){
    return col.every(function(cell){ 
      return !!cell;
    })
  })){
    return true;
  }
  return false;
};

module.exports = Game;
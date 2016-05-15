var Bubble = require('./bubble.js'),
    Layout = require('./layout.js');

var Game = function(ctx, backFn, pauseFn){
  this.ctx = ctx;
  this.grid = Array.from(Array(8), function(spot){
    return Array.from(Array(10));
  });
  this.backFn = backFn;
  this.bubbles = [];
  this.primes = [2, 3, 5, 7, 11,
                13, 17, 19, 23,
                29, 31, 33, 37, 41,
                43, 47, 53, 59, 61,
                67, 71];
  this.colSums = Array.from(Array(8), function(_){return 0;});
  this.turns = 0;
  this.score = 0;
  this.dropHiddenBubbles();
  this.currentBubble = this.addBubble();
  $(document).on("keydown", this.updatePosition.bind(this));
};

Game.prototype.updateScore = function(numOfBubbles){
  if (numOfBubbles === 0) return;
  this.score += numOfBubbles > 7 ? 7 : 2 * Math.pow(2, 2 * numOfBubbles - 1);
};

Game.prototype.updatePosition = function(e){
    var posY = this.currentBubble.pos_y,
        col = this.currentBubble.col;

    if (!this.currentBubble.autoFall){
    switch (e.which){
      case 32:
        e.preventDefault();
        this.currentBubble.setAutoFall();
        break;
      case 37:
        e.preventDefault();
        if (col >= 1 && posY < (this.maxHeightBubbleCanBe(col - 1))){
          this.currentBubble.col--;
        }
        break;
      case 39:
        e.preventDefault();
        if (col <= 6 && posY < (this.maxHeightBubbleCanBe(col + 1))){
          this.currentBubble.col++;
        }
        break;
    }
  }
};
Game.prototype.maxHeightBubbleCanBe = function(col){
  return 730 - ((this.grid[col].indexOf(undefined) + 1) * 60 + 30 + 30);
};

Game.prototype.addBubble = function(){
  var speed = 1,
      randomNum = (Math.random() * 7) <= 6 ? Math.ceil(Math.random() * 5 + 1) : 7,
      col = Math.floor(Math.random() * 8),
      newBubble = new Bubble(this.ctx, col, speed, randomNum);
  this.bubbles.push(newBubble);
  return newBubble;
};
Game.prototype.moveBubbles = function(){
  this.moveCurrentBubble();
  this.moveOtherBubbles();
}
Game.prototype.moveCurrentBubble = function(){
  var bubbleCol = this.currentBubble.col,
      currentCol = this.grid[this.currentBubble.col];
  numOfBubblesInCol = currentCol.reduce(function(a, b){
                                    return a + (!!b ? 1 : 0);
                                  }, 0);
  if (this.currentBubble.pos_y >= (730 - (numOfBubblesInCol * 60 + 30 + 30))){
    this.grid[bubbleCol][numOfBubblesInCol] = this.currentBubble;
    this.colSums[bubbleCol] += this.currentBubble.value;
    this.currentBubble = this.addBubble();
    this.turns++;

    this.checkPrimesInRows();
  } else {
    this.currentBubble.fall();
  }
};

Game.prototype.moveOtherBubbles = function(){
  for (var i = 0; i < this.grid.length; i++){
    var currentCol = this.grid[i];
    if (currentCol.every(function(cell){return !cell;})) continue;
    for (var j = 0; j < currentCol.length; j++){
      if (!currentCol[j]) continue;
      var currentBubble = currentCol[j];
      if (currentBubble.pos_y < (730 - (j * 60 + 30 + 30))){
          currentBubble.fall();
      } else if (currentBubble.pos_y >  (730 - (j * 60 + 60))){
        currentBubble.pos_y = 730 - (j * 60 + 60);
      }
    }
  }
};

Game.prototype.dropHiddenBubbles = function(){
  this.grid.forEach(function(col, idx){
    var randomNum = (Math.random() * 7) <= 6 ? Math.ceil(Math.random() * 5 + 1) : 7;
    var newBubble = new Bubble(this.ctx, idx, 10, randomNum, true, true);
    col[col.indexOf(undefined)] = newBubble;
    this.colSums[idx] += randomNum;
    this.bubbles.push(newBubble);
  }.bind(this));

};

Game.prototype.deleteBubbles = function(coords){
  this.updateScore(coords.length);
  var coords = coords.sort(function(a,b){
    return b[1] - a[1];
  });

  for (var i = 0; i < coords.length; i++){
    var coord = coords[i],
    currentBubble = this.grid[coord[0]][coord[1]];
    var idx = this.bubbles.findIndex(function(bubble){
      return bubble.isEqual(currentBubble);
    });
    if (idx > -1){
      this.colSums[coord[0]] -= currentBubble.value;
      this.grid[coord[0]][coord[1]] = undefined;
      this.unveilSurroundings(coord[0], coord[1]);
      this.grid[coord[0]].splice(coord[1], 1);
      this.grid[coord[0]].push(undefined);
      this.bubbles.splice(idx, 1);
    }
  }
};

Game.prototype.unveilSurroundings = function(col, row){
  if (col < 7 && this.grid[col + 1][row]) this.grid[col + 1][row].unveil();
  if (col > 0 && this.grid[col - 1][row]) this.grid[col - 1][row].unveil();
  if (this.grid[col][row + 1]) this.grid[col][row + 1].unveil();
  if (this.grid[col][row - 1]) this.grid[col][row - 1].unveil();
};

Game.prototype.draw = function(){
  this.ctx.clearRect(0, 0, 640, 800);
  Layout.drawText.apply(this);
  Layout.drawFrame.apply(this);

  if (this.turns === 7){
    this.turns = 0;
    this.dropHiddenBubbles();
  }
  this.bubbles.forEach(function(bubble){
      bubble.draw();
  });
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

Game.prototype.checkPrimesInRows = function(){
  var bubblesToDelete = [];
  for (var i = 0; i < this.grid[0].length; i++){

    var currentSum = 0, startPoint = 0;
    for (var j = 0; j < this.grid.length; j++){
      if (typeof this.grid[j][i] === "undefined" || this.grid[j][i].hidden){
        startPoint = j + 1;
        currentSum = 0;
        continue;
      }
      currentSum += this.grid[j][i].value;

      if (j === (this.grid.length - 1) || typeof this.grid[j + 1][i] === "undefined"
          || this.grid[j + 1][i].hidden){
        if ((j - startPoint) > 0 && this.primes.indexOf(currentSum) > -1){
          for (var m = startPoint; m <= j; m++){
            bubblesToDelete.push([m, i]);
          }
        }
        startPoint = j;
        currentSum = 0;
      }
    }
  }
  this.checkPrimesInCols(bubblesToDelete);
};


Game.prototype.checkPrimesInCols = function(bubblesToDelete){
  for (var j = 0; j < this.colSums.length; j++){
    if (this.grid[j].findIndex(function(cell){
          return !!cell && cell.hidden;
        }) > -1){
      continue;
    }
    if (this.primes.indexOf(this.colSums[j]) > -1 &&
          this.grid[j].reduce(function(a,b){
            return a + (!!b ? 1 : 0);
          },0) > 1){
      for (var m = 0; m < this.grid[j].length; m++){
        if (typeof this.grid[j][m] === "undefined") break;

        if (bubblesToDelete.findIndex(function(coord){
           return coord.toString() === [j, m].toString();
        }) === -1){
           bubblesToDelete.push([j, m]);
        }
      }
    }
  }
  this.deleteBubbles(bubblesToDelete);
  this.updateScore(bubblesToDelete.length);
};
module.exports = Game;

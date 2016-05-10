/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);

	document.addEventListener("DOMContentLoaded", function(){
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext('2d');
		new View(ctx).start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var View = function(ctx){
	  this.ctx = ctx;
	  this.game = new Game(ctx); //I could set difficulties, which takes in # of bubble to start with
	  this.page = 1;
	};

	View.prototype.start = function() {
	  (function(that){
	    var intId = setInterval(function(){
	      that.game.move();
	      that.game.draw();
	      that.hasWon(intId);
	    }, 20);
	  })(this);
	};
	View.prototype.startScreen = function(){
		
	}
	View.prototype.hasWon = function(int) {
		if (this.game.lost()){
			clearInterval(int);
			this.ctx.clearRect(0, 0, 560, 800);
		  this.ctx.font = "36px Arial";
			this.ctx.fillStyle = "black";
			this.ctx.fillText("YOU LOST!", 100, 100);
		}
	};

	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Bubble = __webpack_require__(3);
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
	  
	  this.colSums = Array.from(Array(10), function(_){return 0;});
	  this.timeElapsed = 0;
	  this.turns = 0; //every 7 turns, new balls will drop
	  this.score = 0;
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
	  var speed = 1, //this.timeElapsed / 3000 + 
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
	  this.ctx.clearRect(0, 0, 560, 800);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Bubble = function(ctx, col, speed, value, autoFall, hidden){
	  this.ctx = ctx;
	  this.size = 30;
	  this.pos_y = 0;
	  this.col = col;
	  this.speed = speed;
	  this.value = value;
	  this.color = Bubble.color(value);
	  this.autoFall = autoFall || false;
	  this.hidden = hidden || false;
	};

	Bubble.prototype.moveX = function(keyCode){
	  if (!this.autoFall){
	    switch (keyCode){
	      case 32: //space
	        this.setAutoFall();
	        break;
	      case 37: //left arrow
	        if (this.col >= 1){
	          this.col--;
	        }
	        break;
	      case 39: //right arrow
	        if (this.col <= 6){
	          this.col++;
	        }
	        break;
	      case 40: //accelerate (down arrow)
	        break;
	    }  
	  }
	}
	Bubble.color = function(value){
	  switch(value){
	    case 2:
	      return "#009900";
	      break;
	    case 3:
	      return "#000099";
	      break;
	    case 4:
	      return "#994d00";
	      break;
	    case 5:
	      return "#990000";
	      break;
	    case 6:
	      return "#009999";
	      break;
	    case 7:
	      return "#000000";
	      break;
	  }
	};
	Bubble.prototype.draw = function(){
	  var pos_x = this.col * 60 + 40 + 30;
	  this.ctx.fillStyle = this.hidden ? "black" : this.color;
	  this.ctx.beginPath();
	  this.ctx.arc(pos_x, this.pos_y, this.size, 0, 360);
	  this.ctx.fill();
	  if (!this.hidden){
	    this.ctx.font = "20px Arial";
	    this.ctx.strokeStyle = "white";
	    this.ctx.strokeText(this.value, pos_x - 5, this.pos_y + 5);
	  }
	};

	Bubble.prototype.setAutoFall = function(){
	  this.autoFall = true;
	  this.speed = 10;
	};

	Bubble.prototype.fall = function(){
	  //add condition to move back up
	  //and measure height not with radius but with actual pos
	  this.pos_y += this.speed;
	};

	Bubble.prototype.isEqual = function(bubble){
	  return !!bubble && this.pos_y === bubble.pos_y && this.col === bubble.col &&
	          this.value === bubble.value;
	};

	module.exports = Bubble;

/***/ }
/******/ ]);
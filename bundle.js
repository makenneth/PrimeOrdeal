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
	};

	View.prototype.start = function() {
	  (function(that){
	    var intId = setInterval(function(){
	      that.game.move();
	      that.game.draw();
	    }, 20);
	  })(this);
	};


	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Bubble = __webpack_require__(3);
	var Game = function(ctx){
	  var startTime = Date.now();
	  this.ctx = ctx;
	  this.grid = Array.from(Array(8), function(spot){
	    return Array.from(Array(10));
	  }); //subarrays are columns
	  this.bubbles = [];
	  this.primes= [2, 3, 5, 7, 9,
	                11, 13, 17, 19, 23, 
	                29, 31, 33, 37, 41, 
	                43, 47, 53, 59, 61, 
	                67, 71];
	  this.rowSums = Array.from(Array(8));
	  this.colSums = Array.from(Array(10));
	  this.timeElapsed = startTime - Date.now();
	  this.currentBubble = this.addBubble();
	  $(document).on("keydown", this.updatePosition.bind(this));
	};

	Game.prototype.updatePosition = function(e){
	  this.currentBubble.moveX(e.which);
	};

	Game.prototype.addBubble = function(){
	  var speed = this.timeElapsed / 30000 + 1,
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
	    this.currentBubble.speed = 0;
	    this.grid[bubbleCol][numOfBubblesInCol] = this.currentBubble;
	    this.currentBubble = this.addBubble();
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Bubble = function(ctx, col, speed, value){
	  this.ctx = ctx;
	  this.size = 30;
	  this.pos_y = 0;
	  this.col = col;
	  this.speed = speed;
	  this.value = value;
	  this.color = Bubble.color(value);
	  this.autoFall = false;
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
	  this.ctx.fillStyle = this.color;
	  this.ctx.beginPath();
	  this.ctx.arc(pos_x, this.pos_y, this.size, 0, 360);
	  this.ctx.fill();
	  this.ctx.font = "20px Arial";
	  this.ctx.strokeStyle = "white";
	  this.ctx.strokeText(this.value, pos_x - 5, this.pos_y + 5);
	};
	Bubble.prototype.setAutoFall = function(){
	  this.autoFall = true;
	  this.speed = 10;
	};

	Bubble.prototype.fall = function(){
	  this.pos_y += this.speed;
	};

	module.exports = Bubble;

/***/ }
/******/ ]);
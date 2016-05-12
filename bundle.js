/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
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
	  this.game = new Game(ctx, this.changePage.bind(this, 1), this.pauseGame.bind(this)); //I could set difficulties, which takes in # of bubble to start with
	  this.page = 1;
	  this.paused = false;
	  this.setUpListeners();
	};
	View.prototype.pauseGame = function(){
		this.paused = this.paused === false ? true : false;
	};
	
	View.prototype.setUpListeners = function(){
	  this.startBtn = document.getElementById("start"),
	 	this.instructionBtn = document.getElementById("instruction"),
	 	this.retryBtn = document.getElementById("retry"),
	 	this.backIcon = document.getElementById("back-icon"),
	 	this.instructionText = document.getElementById("instruction-text");
	 	this.backIcon.addEventListener("click", this.changePage.bind(this, 1));
	  this.startBtn.addEventListener("click", this.changePage.bind(this, 2));
	  this.retryBtn.addEventListener("click", this.changePage.bind(this, 1));
	  this.instructionBtn.addEventListener("click", this.changePage.bind(this, 3));
	};
	
	
	View.prototype.changePage = function(page, e){
		this.page = page;
		if (e.target.id === "retry"){
			this.game = new Game(this.ctx, this.changePage.bind(this, 1)); 
		}
		switch (page){
			case 3:
			  this.instructionText.className = "";
				this.backIcon.className = "";
				this.startBtn.className = "hidden";
				this.instructionBtn.className = "hidden";
				this.retryBtn.className = "hidden";
				break;
			case 2:
				this.instructionText.className = "hidden";
				this.backIcon.className = "";
				this.startBtn.className = "hidden";
				this.instructionBtn.className = "hidden";
				this.retryBtn.className = "hidden";
				break;
			case 1:
				this.instructionText.className = "hidden";
				this.startBtn.className = "";
				this.instructionBtn.className = "";
				this.retryBtn.className = "hidden";
				this.backIcon.className = "hidden";
				break;
			}
	};
	
	View.prototype.start = function() {
	    var intId = setInterval(function(){
	    	switch (this.page){
	    		case 1:
	    			this.startScreen();
	    			break;
	    		case 2:
	    			this.gameScreen.call(this, intId);
	    			break;
	    		case 3:
	    			this.instructionScreen();
	    			break;
	    		case 5:
	    		 this.loseScreen.call(this, intId);
	    		 this.retryBtn.className = "";
		 			this.retryBtn.disabled = false;
	    			break;
	    	}
	    }.bind(this), 20);
	};
	
	View.prototype.gameScreen = function(intId){
			if (!this.paused){
				    this.game.draw();
	    this.game.moveBubble();
	    this.hasWon(intId);
			}
	
	};
	View.prototype.startScreen = function(){
		this.ctx.clearRect(0, 0, 640, 800);
		this.ctx.font = "64px Handlee";
		this.ctx.fillStyle = "black";
		this.ctx.fillText("PrimeOrdeal", 150, 300);
	}
	
	View.prototype.instructionScreen = function(){
		this.ctx.clearRect(0, 0, 640, 800);
	
	};
	
	View.prototype.hasWon = function() {
		if (this.game.lost()){
			this.page = 5;
		}
	};
	View.prototype.loseScreen = function(){
		this.ctx.clearRect(0, 0, 640, 800);
	  this.ctx.font = "36px Lato";
		this.ctx.fillStyle = "black";
		this.ctx.fillText("YOU LOST!", 140, 140);
		this.ctx.font = "36px Lato";
		this.ctx.fillStyle = "black";
		this.ctx.fillText("Your score was:", 140, 340);
		this.ctx.font = "36px Lato";
		this.ctx.fillStyle = "black";
		this.ctx.fillText(this.game.score, 140, 380);
	};
	
	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Bubble = __webpack_require__(3),
	    Layout = __webpack_require__(4);
	var Game = function(ctx, backFn, pauseFn){
	  this.ctx = ctx;
	  this.grid = Array.from(Array(8), function(spot){
	    return Array.from(Array(10));
	  }); 
	  this.backFn = backFn;
	  this.pauseFn = pauseFn;
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
	  $(document).on("click", this.pauseFn);
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
	        this.currentBubble.setAutoFall();
	        break;
	      case 37: 
	        if (col >= 1 && posY < (750 - ((this.grid[col - 1].indexOf(undefined) + 1) * 60 + 30 + 30))){
	          this.currentBubble.col--;
	        }
	        break;
	      case 39:
	        if (col <= 6 && posY < (750 - ((this.grid[col + 1].indexOf(undefined) + 1) * 60 + 30 + 30))){
	          this.currentBubble.col++;
	        }
	        break;
	    }  
	  }
	};
	
	Game.prototype.addBubble = function(){
	  var speed = 1,  
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
	    this.checkPrimesInRows();
	  } else {
	    this.currentBubble.fall(); 
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
	    col[col.indexOf(undefined)] = newBubble;
	    this.colSums[idx] += randomNum;
	    this.bubbles.push(newBubble);
	  }.bind(this));
	
	 //add sum to col
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
	
	Game.prototype.deleteBubbles = function(coords){
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
	  this.image = document.getElementById("source");
	};
	
	Bubble.color = function(value){
	  switch(value){
	    case 2:
	      return [0, 0];
	      break;
	    case 3:
	      return [202, 202];
	      break;
	    case 4:
	      return [404, 0];
	      break;
	    case 5:
	      return [404, 202];
	      break;
	    case 6:
	      return [202, 404];
	      break;
	    case 7:
	      return [0, 404];
	      break;
	  }
	};
	Bubble.prototype.draw = function(){
	  var pos_x = this.col * 60 + 120 + 30;
	  var color = this.hidden ? [202, 0] : this.color;
	  this.ctx.beginPath();
	
	  this.ctx.drawImage(this.image, color[0], color[1], 200, 200, pos_x - 30, this.pos_y - 32, 65, 65);
	  if (!this.hidden){
	    this.ctx.font = "20px Lato";
	    this.ctx.strokeStyle = "white";
	    this.ctx.strokeText(this.value, pos_x - 5, this.pos_y + 5);
	  }
	};
	
	Bubble.prototype.setAutoFall = function(){
	  this.autoFall = true;
	  this.speed = 10;
	};
	
	Bubble.prototype.fall = function(){
	  this.pos_y += this.speed;
	};
	
	Bubble.prototype.isEqual = function(bubble){
	  return !!bubble && this.pos_y === bubble.pos_y && this.col === bubble.col &&
	          this.value === bubble.value;
	};
	
	Bubble.prototype.unveil = function(){
	  this.hidden = false;
	};
	
	module.exports = Bubble;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
		drawText: function(){
			this.ctx.font = "36px Lato";
		  this.ctx.fillStyle = "black";
		  this.ctx.fillText("PrimeOrdeal", 40, 60);
		  this.ctx.font = "24px Lato";
		  this.ctx.fillStyle = "black";
		  this.ctx.fillText("Score", 24, 280);
		  this.ctx.font = "24px Lato";
		  this.ctx.fillStyle = "black";
		  var textWidth = this.ctx.measureText(this.score).width;
		  this.ctx.fillText(this.score, textWidth + 48 - 1.3 * textWidth, 320);
		  this.ctx.font = "20px Lato";
		  this.ctx.fillStyle = "black";
		  this.ctx.fillText("Turns Left", 14, 520);
		  this.ctx.font = "24px Lato";
		  this.ctx.fillStyle = "black";
		  this.ctx.fillText(7 - this.turns, 44, 560);
		},
		drawFrame: function(){
			this.ctx.beginPath();
		  this.ctx.lineWidth = 4;
		  this.ctx.moveTo(118, 120);
		  this.ctx.lineTo(118, 722);
		  this.ctx.lineTo(602, 722);
		  this.ctx.lineTo(602, 120);
		  this.ctx.strokeStyle = "black";
		  this.ctx.stroke();
		  this.ctx.lineWidth = 2;
		  this.ctx.fillStyle = "black";
		}
	}

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
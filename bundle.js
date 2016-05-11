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
	  this.game = new Game(ctx); //I could set difficulties, which takes in # of bubble to start with
	  this.page = 1;
	  document.addEventListener("click", this.findMousePos.bind(this));
	  document.onmousemove = this.moveMouse.bind(this);
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
	    		case 5:
	    		 this.loseScreen.call(this, intId);
	    			break;
	    	}
	    }.bind(this), 20);
	};
	View.prototype.moveMouse = function(event){
			if (this.page === 1){
			var x = event.pageX,
					y = event.pageY;
			if (x >= 154 && x <= 227 && y <= 116 && y >= 86){
				this.ctx.beginPath();
				this.ctx.rect(114, 64, 93, 50);
				this.ctx.stroke();
			} else if (x >= 136 && x <= 316 && y >= 131 && y <= 171){
				this.ctx.beginPath();
				this.ctx.rect(105, 110, 220, 55);
				this.ctx.stroke();
			}
		}
	};
	View.prototype.findMousePos = function(event){
		if (this.page === 1){
			var x = event.pageX,
					y = event.pageY;
			if (x >= 154 && x <= 227 && y <= 116 && y >= 86){
				this.page = 2;
			} else if (x >= 136 && x <= 316 && y >= 131 && y <= 171){
				this.page = 3;
			}	else if (x >= 161 && x <= 246 && y >= 512 && y <= 545){
				this.page = 2;
			}
		}
	};
	View.prototype.gameScreen = function(intId){
		  // this.game.move();
	    this.game.draw();
	    this.game.moveBubble();
	    this.hasWon(intId);
	};
	View.prototype.startScreen = function(){
		this.ctx.clearRect(0, 0, 640, 800);
		this.ctx.font = "64px Lato";
		this.ctx.fillStyle = "black";
		this.ctx.fillText("PrimeOrdeal", 140, 400);
		this.ctx.font = "36px Lato";
		this.ctx.fillText("Start", 120, 100);
		this.ctx.font = "36px Lato";
		this.ctx.fillText("Instructions", 120, 150);
	
	}
	View.prototype.hasWon = function() {
		if (this.game.lost()){
			this.page = 5;
		}
	};
	View.prototype.loseScreen = function(int){
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
		this.ctx.font = "36px Lato";
		this.ctx.fillStyle = "black";
		this.ctx.fillText("Retry", 140, 520);
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
	  
	  this.colSums = Array.from(Array(8), function(_){return 0;});
	  this.timeElapsed = 0;
	  this.turns = 0; 
	  this.score = 0;
	  this.dropHiddenBubbles();
	  this.currentBubble = this.addBubble();
	  $(document).on("keydown", this.updatePosition.bind(this));
	  setInterval(this.incrementTime.bind(this), 10)
	};
	Game.prototype.updateScore = function(numOfBubbles){
	  if (numOfBubbles === 0) return;
	  this.score += 2 * Math.pow(2, 2 * numOfBubbles - 1);
	};
	Game.prototype.incrementTime = function(){
	  this.timeElapsed++;
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
	          col--;
	        }
	        break;
	      case 39:
	        if (col <= 6 && posY < (750 - (this.grid[col + 1] * 60 + 30 + 30))){
	          col++;
	        }
	        break;
	    }  
	  }
	  // this.currentBubble.moveX(e.which);
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
	  console.log(this.colSums);
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
	    this.colSums[idx] += randomNum;
	    this.bubbles.push(newBubble);
	  }.bind(this));
	
	 //add sum to col
	};
	Game.prototype.drawText= function(){
	  this.ctx.clearRect(0, 0, 640, 800);
	  this.ctx.font = "36px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("PrimeOrdeal", 40, 60);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("Score", 24, 280);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText(this.score, 44, 320);
	  this.ctx.font = "20px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("Turns Left", 14, 520);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText(10 -this.turns, 44, 560);
	}
	
	Game.prototype.draw = function(){
	  this.drawText();
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
	  if (this.turns === 10){
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
	
	      if (j === (this.grid.length - 1) || typeof this.grid[j + 1][i] === "undefined"){
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
	  //so I can shift bubble from the top down,
	  //not having to worry about
	  coords.forEach(function(coord){
	    var currentBubble = this.grid[coord[0]][coord[1]];
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
	  }.bind(this));
	};
	
	Game.prototype.unveilSurroundings = function(col, row){
	  if (col < 6 && this.grid[col + 1][row]) this.grid[col + 1][row].unveil();
	  if (col > 1 && this.grid[col - 1][row]) this.grid[col - 1][row].unveil();
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
	};
	
	Bubble.prototype.moveX = function(keyCode){
	  if (!this.autoFall){
	    switch (keyCode){
	      case 32: 
	        this.setAutoFall();
	        break;
	      case 37: 
	        if (this.col >= 1){
	          this.col--;
	        }
	        break;
	      case 39:
	        if (this.col <= 6){
	          this.col++;
	        }
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
	  var pos_x = this.col * 60 + 120 + 30;
	  this.ctx.fillStyle = this.hidden ? "#333" : this.color;
	  this.ctx.beginPath();
	  this.ctx.arc(pos_x, this.pos_y, this.size, 0, 360);
	  this.ctx.fill();
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
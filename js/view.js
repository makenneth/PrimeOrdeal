var Game = require('./game.js');
var View = function(ctx){
  this.ctx = ctx;
  this.game = new Game(ctx, this.back.bind(this)); //I could set difficulties, which takes in # of bubble to start with
  this.page = 1;
  this.paused = false;
  document.addEventListener("click", this.findMousePos.bind(this));
  document.onmousemove = this.moveMouse.bind(this);
};

View.prototype.togglePause = function(){
	if (this.paused){
		this.paused = false;
	} else {
		this.paused = true;
	}
};
View.prototype.back = function(){
	this.page = 1;
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
	  if (!this.paused){
	    this.game.draw();
	    this.game.moveBubble();
	    this.hasWon(intId);
	  }
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
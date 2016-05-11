var Game = require('./game.js');
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
	this.ctx.font = "64px Arial";
	this.ctx.fillStyle = "black";
	this.ctx.fillText("PrimeOrdeal", 140, 400);
	this.ctx.font = "36px Arial";
	this.ctx.fillText("Start", 120, 100);
	this.ctx.font = "36px Arial";
	this.ctx.fillText("Instructions", 120, 150);

}
View.prototype.hasWon = function() {
	if (this.game.lost()){
		this.page = 5;
	}
};
View.prototype.loseScreen = function(int){
	clearInterval(int);
	this.ctx.clearRect(0, 0, 640, 800);
  this.ctx.font = "36px Arial";
	this.ctx.fillStyle = "black";
	this.ctx.fillText("YOU LOST!", 140, 140);
	this.ctx.font = "36px Arial";
	this.ctx.fillStyle = "black";
	this.ctx.fillText("Your score was:", 140, 340);
	this.ctx.font = "36px Arial";
	this.ctx.fillStyle = "black";
	this.ctx.fillText(this.game.score, 140, 380);
};

module.exports = View;
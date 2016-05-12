var Game = require('./game.js');

var View = function(ctx){
  this.ctx = ctx;
  this.game = new Game(ctx, this.changePage.bind(this, 1)); //I could set difficulties, which takes in # of bubble to start with
  this.page = 1;
  this.paused = false;
  this.setUpListeners();
};

View.prototype.setUpListeners = function(){
  this.startBtn = document.getElementById("start"),
 	this.instructionBtn = document.getElementById("instruction"),
 	this.retryBtn = document.getElementById("retry");
 	this.backIcon = document.getElementById("back-icon");
 	this.backIcon.addEventListener("click", this.changePage.bind(this, 1));
  this.startBtn.addEventListener("click", this.changePage.bind(this, 2));
  this.retryBtn.addEventListener("click", this.changePage.bind(this, 1));
  this.instructionBtn.addEventListener("click", this.changePage.bind(this, 3));
};


View.prototype.changePage = function(page){
	this.page = page;
	switch (page){
		case 2:
			this.backIcon.className = "";
			this.startBtn.className = "hidden";
			this.instructionBtn.className = "hidden";
			this.retryBtn.className = "hidden";
			break;
		case 1:
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
    		case 5:
    		 this.loseScreen.call(this, intId);
    		 this.retryBtn.className = "";
    			break;
    	}
    }.bind(this), 20);
};

View.prototype.gameScreen = function(intId){
	  // this.game.move();
    this.game.draw();
    this.game.moveBubble();
    this.hasWon(intId);
};
View.prototype.startScreen = function(){
	this.ctx.clearRect(0, 0, 640, 800);
	this.ctx.font = "64px Handlee";
	this.ctx.fillStyle = "black";
	this.ctx.fillText("PrimeOrdeal", 150, 300);
}
View.prototype.hasWon = function() {
	if (this.game.lost()){
		this.page = 5;
		this.game = new Game(this.ctx, this.changePage.bind(this, 1)); 
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
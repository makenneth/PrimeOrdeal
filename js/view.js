var Game = require('./game.js');
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
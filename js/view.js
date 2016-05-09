var Game = require('./game.js');
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
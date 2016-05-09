var Game = require('./game.js');
var View = function(ctx){
  this.ctx = ctx;
  this.game = new Game(20, ctx);
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
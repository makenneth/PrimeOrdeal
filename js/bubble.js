var Bubble = function(ctx, position, speed, value){
  this.ctx = ctx;
  this.size = 30;
  this.pos = position;
  this.speed = speed;
  this.value = value;
  this.color = Bubble.color(value);
};

Bubble.prototype.move = function(keyCode){
  switch (keyCode){
    case 32: //space
      //speedy drop
      break;
    case 37: //left arrow
      if (this.pos[0] >= 130){
        this.pos[0] -= 60; //account for width that is greater
      }
      break;
    case 39: //right arrow
      if (this.pos[0] <= 490){
        this.pos[0] += 60;
      }
      break;
    case 40: //accelerate (down arrow)
      break;
  }
}
Bubble.color = function(value){
  return switch (value){
    case 2:
      "#009900";
      break;
    case 3:
      "#000099";
      break;
    case 4:
      "#994d00";
      break;
    case 5:
      "#990000";
      break;
    case 6:
      "#009999";
      break;
    case 7:
      "#000000";
      break;
  }
};
Bubble.prototype.draw = function(){
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.size, 0, 360);
  ctx.fill();
  ctx.strokeText(this.value, this.pos[0] - 3, this.pos[1] + 3);
};
Bubble.prototype.freefall = function(){

};

Bubble.prototype.fall = function(){
  //add stop moving condition, probably in game
  //if space bar 
  this.pos[1] += this.speed;
};

module.exports = Bubble;
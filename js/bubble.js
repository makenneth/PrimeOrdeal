var Bubble = function(ctx, col, speed, value){
  this.ctx = ctx;
  this.size = 30;
  this.pos_y = 0;
  this.col = col;
  this.speed = speed;
  this.value = value;
  this.color = Bubble.color(value);
  this.freefall = false;
};

Bubble.prototype.move = function(keyCode){
  if (!freefall){
    switch (keyCode){
      case 32: //space
        this.setAutoFall();
        break;
      case 37: //left arrow
        if (this.col >= 1){
          this.col--; //account for width that is greater
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
  var pos_x = this.col * 60 + 40 + 30;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(pos_x, this.pos_y, this.size, 0, 360);
  ctx.fill();
  ctx.strokeText(this.value, pos_x - 3, this.pos_y + 3);
};
Bubble.prototype.setAutoFall = function(){
  this.freefall = true;
  this.speed = 10;
};

Bubble.prototype.fall = function(){
  this.pos[1] += this.speed;
};

module.exports = Bubble;
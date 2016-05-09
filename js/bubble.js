var Bubble = function(ctx, col, speed, value){
  this.ctx = ctx;
  this.size = 30;
  this.pos_y = 0;
  this.col = col;
  this.speed = speed;
  this.value = value;
  this.color = Bubble.color(value);
  this.autoFall = false;
};

Bubble.prototype.moveX = function(keyCode){
  if (!autoFall){
    switch (keyCode){
      case 32: //space
        this.setAutoFall();
        break;
      case 37: //left arrow
        if (this.col >= 1){
          this.col--;
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
  var pos_x = this.col * 60 + 40 + 30;
  this.ctx.fillStyle = this.color;
  this.ctx.beginPath();
  this.ctx.arc(pos_x, this.pos_y, this.size, 0, 360);
  this.ctx.fill();
  this.ctx.font = "20px Arial";
  this.ctx.strokeStyle = "white";
  this.ctx.strokeText(this.value, pos_x - 5, this.pos_y + 5);
};
Bubble.prototype.setAutoFall = function(){
  this.autoFall = true;
  this.speed = 10;
};

Bubble.prototype.fall = function(){
  this.pos_y += this.speed;
};

module.exports = Bubble;
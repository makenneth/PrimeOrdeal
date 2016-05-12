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
  this.image = document.getElementById("source");
};

Bubble.color = function(value){
  switch(value){
    case 2:
      return [0, 0];
      break;
    case 3:
      return [202, 202];
      break;
    case 4:
      return [404, 0];
      break;
    case 5:
      return [404, 202];
      break;
    case 6:
      return [202, 404];
      break;
    case 7:
      return [0, 404];
      break;
  }
};
Bubble.prototype.draw = function(){
  var pos_x = this.col * 60 + 120 + 30;
  var color = this.hidden ? [202, 0] : this.color;
  this.ctx.beginPath();

  this.ctx.drawImage(this.image, color[0], color[1], 200, 200, pos_x - 30, this.pos_y - 32, 65, 65);
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
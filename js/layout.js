module.exports = {
	drawText: function(){
		this.ctx.font = "36px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("PrimeOrdeal", 40, 60);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("Score", 24, 260);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  var textWidth = this.ctx.measureText(this.score).width;
	  this.ctx.fillText(this.score, textWidth + 48 - 1.3 * textWidth, 300);
	  this.ctx.font = "20px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("Turns Left", 14, 500);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText(7 - this.turns, 44, 540);
	},
	drawFrame: function(){
		this.ctx.beginPath();
	  this.ctx.lineWidth = 10;
	  this.ctx.moveTo(116, 100);
	  this.ctx.lineTo(116, 704);
	  this.ctx.lineTo(606, 704);
	  this.ctx.lineTo(606, 100);
	  this.ctx.lineTo(111, 100);
	  this.ctx.strokeStyle = "blue";
	  this.ctx.stroke();
	  this.ctx.globalAlpha = 0.8;
	  this.ctx.fillStyle = "black";
	  this.ctx.fill();
	  this.ctx.closePath	();
	  this.ctx.globalAlpha = 1;
	  this.ctx.lineWidth = 2;
	  this.ctx.fillStyle = "black";
	}
}
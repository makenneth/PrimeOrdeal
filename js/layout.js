module.exports = {
	drawText: function(){
		this.ctx.font = "36px Exo";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("PrimeOrdeal", 220, 60);
	  this.ctx.font = "24px Exo";
	  this.ctx.fillText("Score", 24, 300);
	  this.ctx.font = "24px Exo";
	  var textWidth = this.ctx.measureText(this.score).width;
	  this.ctx.fillText(this.score, textWidth + 48 - 1.3 * textWidth, 340);
	  this.ctx.font = "24px Exo";
	  this.ctx.fillText("Turns", 22, 460);
	  this.ctx.fillText("left", 32, 490);
	  this.ctx.font = "24px Exo";
	  this.ctx.fillText(7 - this.turns, 44, 530);
	},
	drawFrame: function(){
		this.ctx.beginPath();
	  this.ctx.lineWidth = 10;
	  this.ctx.moveTo(116, 100);
	  this.ctx.lineTo(116, 704);
	  this.ctx.lineTo(606, 704);
	  this.ctx.lineTo(606, 100);
	  this.ctx.lineTo(111, 100);
	  this.ctx.strokeStyle = "#00203c";
	  this.ctx.stroke();
	  this.ctx.globalAlpha = 0.8;
	  this.ctx.fillStyle = "#00060b";
	  this.ctx.fill();
	  this.ctx.closePath	();
	  this.ctx.globalAlpha = 1;
	  this.ctx.lineWidth = 2;
	  this.ctx.fillStyle = "black";
	}
}
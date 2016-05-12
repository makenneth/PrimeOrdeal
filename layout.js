module.exports = {
	drawText: function(){
		this.ctx.font = "36px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("PrimeOrdeal", 40, 60);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("Score", 24, 280);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  var textWidth = this.ctx.measureText(this.score).width;
	  this.ctx.fillText(this.score, textWidth + 48 - 1.3 * textWidth, 320);
	  this.ctx.font = "20px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText("Turns Left", 14, 520);
	  this.ctx.font = "24px Lato";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText(7 - this.turns, 44, 560);
	},
	drawFrame: function(){
		this.ctx.beginPath();
	  this.ctx.lineWidth = 4;
	  this.ctx.moveTo(118, 120);
	  this.ctx.lineTo(118, 722);
	  this.ctx.lineTo(602, 722);
	  this.ctx.lineTo(602, 120);
	  this.ctx.strokeStyle = "black";
	  this.ctx.stroke();
	  this.ctx.lineWidth = 2;
	  this.ctx.fillStyle = "black";
	}
}
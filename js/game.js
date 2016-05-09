var Game = function(ctx){
	this.startTime = Date.now();
	this.ctx = ctx;
	this.grid = Array.from(Array(10), function(spot){
		return Array.from(Array(8));
	});
	this.bubbles = [];
	this.primes= [2, 3, 5, 7, 9, 11, 13, 17, 19, 23, 29, 31, 33, 37];
	this.rowSums = Array.from();
	this.timeElapsed = startTime - Date.now();
	this.addBubble();
	$("body").on("keydown", this.updatePosition);
};

Game.updatePosition = function(e){
	this.currentBubble.move(e.which);
};

Game.prototype.addBubble = function(){
	//x based on the position of the mouse..or just completely randomize
	var speed = this.timeElapsed / 30000 + 1,
			randomNum = Math.ceil(Math.random() * 6 + 1),
			xPos = Math.floor(Math.random() * 8) * 60 + 40 + 30, //(canvas size/6) (offset for 40 pixel) (30f for radius)
			newBubble = new Bubble(this.ctx, [xPos, 0], speed, randomNum);
	this.currentBubble = newBubble;
	this.bubbles.push(newBubble)
};

Game.prototype.draw = function(){
	clearRect(0, 0, 600, 600); //600 should be ctx width and height
	this.bubbles.forEach(function(bubble){
		bubble.draw(); //somehow stop the bubble from moving if it reaches certain position
	});
};

Game.prototype.findPrimes = function(){ 
	
};

Game.prototype.lost = function(){
	if (this.grid.all(function(row){
		return row.all(function(cell){ 
			return !!cell;
		})
	}){
		return true;
	}
	return false;
};
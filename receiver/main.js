
function Player (senderID, number) {
	this.id = senderID || undefined;
	this.number = number || null;
	this.paddle = new createPaddle(this.number);
	this.score = 0;
}



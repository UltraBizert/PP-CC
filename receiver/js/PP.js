window.requestAnimFrame = (function(){
return window.RequestAnimationFrame || 
		function( callback ){
			return window.setTimeout(callback, 1000 / 30);
		};
})();

window.cancelRequestAnimFrame = ( function() {
return window.CancelRequestAnimationFrame ||
		clearTimeout
} )();

function createBall () {

	this.x = W/2,
	this.y = H/2, 
	this.r = 5,
	this.vx = W/300 * random(),
	this.vy = H/100 * random();
	this.c = "white";

	this.draw = function (context) {
		context.beginPath();
		context.fillStyle = this.c;
		context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		context.fill();
	};

	this.move = function () {
		this.x += this.vx;
		this.y += this.vy;
	}
}

function Playground (context) {
	this.context = context || undefined;

	this.init = function (paddle1, paddle2, ball, gameType) {
		this.p1 = paddle1 || [];
		this.p2 = paddle2 || [];
		this.ball = ball || {};
		this.gameType = gameType || {};
	}

	this.draw = function (context) {
		this.context.fillStyle = '#272';
		this.context.fillRect(0,0,W,H);
		this.p1.draw(this.context);
		this.p2.draw(this.context);
		this.ball.draw(this.context);
		updateScore(this.context, this.gameType, this.p1, this.p2);
	};

	this.main = function (gameStage) {
		if(gameStage === "Round") {
		this.ball.move();
		checkCollides(this.ball, this.p1, this.p2);
		this.draw();
		} else {
			pause(this.context);
		}
	}
}

function Paddle(pos) {

	this.h = 10;
	this.w = 200;
	this.x = W/2-this.w/2;
	this.score = 0;

	if (pos === 1) {
		this.y = 0;
		this.friendsScore = 0;
	} else this.y = H-this.h;

	this.draw = function (context) {
		context.fillStyle = "white";
		context.fillRect(this.x, this.y, this.w, this.h);
	}

	this.move = function (data) {
		if(data.move === true) {
			switch (data.direction) {
			case "left":
				if(this.x >= 0) this.x-= 15;
			break;
			case "right":
				if(this.x <= W-this.w)this.x += 15;
			break;
			}
		}
	}
}

function checkCollides (ball, p1, p2) {

	if(collides(ball, p1)) {
		collideAction(ball, p1);
		p1.friendsScore++;
	}
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
		p1.friendsScore++;
	}
	else {
		// increaseSpd(p1.score+p2.score);
		if(ball.y + ball.r > H) {
			ball.y = H/2;
			ball.x = W/2;
			p2.score++;
		}
		else if(ball.y < 0) {
			ball.y = H/2;
			ball.x = W/2;
			p1.score++;
		}

		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}

		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
}

function collides(b, p) {
	if(b.x + b.r >= p.x && b.x - b.r <=p.x + p.w) {

		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		else return false;
	}
}

function collideAction(ball, p) {
	ball.vy = -ball.vy;

	if(paddleHit == 1) {
		ball.y = p.y - p.h;
	}

	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
	}
}

function updateScore(context, type, paddle1, paddle2) {
	context.fillStyle = "white";
	context.font = "16px Arial, sans-serif";
	context.textAlign = "left";
	context.textBaseline = "top";

	if(type == 'opponents'){
		context.fillText( paddle2.score, W/2, H/2-paddle2.y/4 );
		context.fillText( paddle1.score, W/2, H/2+paddle2.y/4 );
	} else if (type == 'friends') {
		context.fillText( paddle1.friendsScore, W/2, H/2);
	}
}

function pause (context) {
	context.fillStyle = "white";
	context.font = "16px Arial, sans-serif";
	context.textAlign = "left";
	context.textBaseline = "top";

	context.fillText("Game on pause", W/2-W/20, H/2);
}

function random () {
	if(Math.floor(Math.random()*2) == 0) return 1;
		else return -1;
}
function Playground (context) {
	this.context = context || undefined;

	this.init = function (paddle1, paddle2, ball, game) {
		this.p1 = paddle1 || [];
		this.p2 = paddle2 || [];
		this.ball = ball || {};
		this.game = game || {};

		this.p1.score = 0;
		this.p2.score = 0;
	}

	this.draw = function () {

		this.context.fillStyle = '#272';
		this.context.fillRect(0,0,W,H);

		this.p1.draw(this.context);
		this.p2.draw(this.context);
		this.ball.draw(this.context);

		updateScore(this.context, this.game, this.p1, this.p2, this.ball.score);
	};

	this.main = function (gameStage) {
		console.log(gameStage);
		switch (gameStage){

		case "Ready":
			console.log("ready");
			ready(this.context, this.p1, this.p2);
		break;

		case "Round":
			this.ball.move();
			checkCollides(this.ball, this.p1, this.p2);
			this.draw();
		break;

		case "Pause":
			stop(requestId);
			pause(this.context);
			console.log("game on pause");
		break;

		case "End game":
			stop(requestId);
			gameOver(this.context);

			setTimeout(waiting(this.context, "ready", "ready"), 3000);
		break;
		}
	};

}

function createBall () {

	this.x = W/2,
	this.y = H/2, 
	this.r = H/50,
	this.vx = W/300 * random(),
	this.vy = H/100 * random();
	this.score = 0;
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

function Paddle(pos) {

	this.h = H/50;
	this.w = W/5;
	this.x = W/2-this.w/2;
	this.y = (pos === 1) ? 0 : H-this.h;
	this.position = (pos === 1) ? "top" : "bottom";
	this.score = 0;

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
	}
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	}
	else {
		// increaseSpd(p1.score+p2.score);
		if(ball.y+ball.r>H){
			ball.vy=-ball.vy;
			ball.y=H-ball.r;
			p2.score++;
		}
		else if(ball.y<0){
			ball.vy=-ball.vy;
			ball.y=ball.r;
			p1.score++;
		}

		if(ball.x+ball.r>W){
			ball.vx=-ball.vx;
			ball.x=W-ball.r;
		}

		else if(ball.x-ball.r<0){
			ball.vx=-ball.vx;
			ball.x=ball.r;
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
	ball.score++;
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
	}

	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
	}
}

function updateScore(context, game, paddle1, paddle2, score) {

	textStyle(context, H/35, "white");

	if(game.type == 'opponents'){
		context.fillText( paddle2.score, W/2, H/2-paddle2.y/4 );
		context.fillText( paddle1.score, W/2, H/2+paddle2.y/4 );
		if(paddle1.score>=10 || paddle2.score>=10) game.stage = "End game";
	} else if (game.type == 'friends') {
		context.fillText( score, W/2, H/2);
		if (paddle1.score!=0 || paddle2.score!=0) game.stage = "End game";
	}
}

function pause (context) {
	textStyle(context, H/10, "#666")
	context.fillText("Game on pause", W/2-W/20, H/2);
}

function gameOver (context) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "red");
	context.fillText("GAME OVER", W/2-W/10, H/2-H/20);
}

function waiting (context, p1, p2) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "#345");
	context.fillText("PING-PONG", W/3, H/10);

	textStyle(context, H/20, "#345");

	if (p1 == null) {
		context.fillText("Ожидание первого игрока", W/10, H/4);
	}

	if (p2 == null) {
		context.fillText("Ожидание второго игрока", W-W/2.2, H/4);
	}

	if (p1 == "connected") {
		context.fillText("Первый игрок подключен", W/10, H/4);
	}

	if(p2 == "connected") {
		context.fillText("Второй игрок подключен", W-W/2.2, H/4);
	}

	if (p1 == "ready") {
		context.fillText("Первый игрок готов", W/10, H/4);
	}

	if (p2 == "ready") {
		context.fillText("Второй игрок готов", W-W/2.2, H/4);
	}

}

function ready (context, p1, p2) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	p1.draw(context);
	p2.draw(context);

	textStyle(context, H/10, "#345");
	context.fillText("Press ready to start the game", W/2-W/4, H/2-H/20);
}

function count (context) {
	textStyle(context, H/10, "#5B5CE5");

	setTimeout(function() {
		context.fillText("3", W/3, H/3);
	}, 1000);
	setTimeout(function() {
		context.fillText("2", W/3+W/10, H/3);
	}, 2000);
	setTimeout(function() {
		context.fillText("1", W/3+W/5, H/3);
	}, 3000);
	return "ok";
}

function startScreen (context, p1, p2) {
	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "#345");
	context.fillText("PING-PONG", W/3, H/10);
	console.log('it work');
}

function textStyle(context, size, color) {
	context.font = size+"px Arial, sans-serif";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillStyle = color;
}

function random () {
	if(Math.floor(Math.random()*2) == 0) return 1;
		else return -1;
}
function Playground (context) {
	this.context = context || undefined;

	this.init = function (player1, player2, ball, game) {
		this.p1 = player1 || [];
		this.p2 = player2 || [];
		this.ball = ball || {};
		this.game = game || {};

		this.r1 = this.p1.paddle;
		this.r2 = this.p2.paddle;
	}

	this.draw = function () {

		this.context.fillStyle = '#272';
		this.context.fillRect(0,0,W,H);

/*		context.shadowColor="#372244";
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.shadowBlur = 5
*/

		this.r1.draw(this.context);
		this.r2.draw(this.context);
		this.ball.draw(this.context);

		updateScore(this.context,this.game, 
						this.p1,
						this.p2,
						this.ball.score);
	};

	this.main = function (gameStage, paddles) {

		switch (gameStage){

		case "Ready":
			console.log("ready");
			ready(this.context, this.r1, this.r2);
		break;

		case "Round":
			this.r1.move(paddles[0]);
			this.r2.move(paddles[1]);
			this.ball.move();
			checkCollides(this.ball, this.r1, this.r2);
			this.draw();
		break;

		case "Pause":
			stop();
			pause(this.context);
			console.log("game on pause");
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
				if(this.x >= 0) this.x-= W/40;
			break;
			case "right":
				if(this.x <= W-this.w)this.x += W/60;
			break;
			}
		}
	}
}

function checkCollides (ball, r1, r2) {

	if(collides(ball, r1)) {
		collideAction(ball, r1);
	}
	else if(collides(ball, r2)) {
		collideAction(ball, r2);
	}
	else {
		// increaseSpd(r1.score+r2.score);
		if(ball.y+ball.r>H){
			ball.vy=-ball.vy;
			ball.y=H-ball.r;
			r2.score++;
		}
		else if(ball.y<0){
			ball.vy=-ball.vy;
			ball.y=ball.r;
			r1.score++;
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

function updateScore(context, game, player1, player2, score) {

	textStyle(context, H/35, "white");
	paddle1 = player1.paddle;
	paddle2 = player2.paddle;

	if(game.type == 'opponents'){
		context.fillText( paddle2.score, W/2, H/2-paddle2.y/4 );
		context.fillText( paddle1.score, W/2, H/2+paddle2.y/4 );

		if(paddle1.score>=5) {
			game.stage = "End game";
			paddle1.score = 0;
			paddle2.score = 0;

			stop();
			gameOver(context, "Победил первый игрок");

			setTimeout(function() {
				waiting(context, player1, player2);
			}, 5000);
		} else if(paddle2.score>=5) {
			game.stage = "End game";

			paddle1.score = 0;
			paddle2.score = 0;

			stop();
			gameOver(context, "Победил второй игрок");

			setTimeout(function() {
				waiting(context, player1, player2);
			}, 5000);
		}

	} else if (game.type == 'friends') {
		context.fillText( score, W/2, H/2);

		if (paddle1.score!=0 || paddle2.score!=0) {
			game.stage = "End game";
			paddle1.score = 0;
			paddle2.score = 0;

			stop();
			gameOver(context, "Вы набрали "+score+" очков");

			setTimeout(function() {
				waiting(context, player1, player2);
			}, 5000);
		}

	}
}

function pause (context) {
	textStyle(context, H/10, "#3B518F", true);
	context.textBaseline = "bottom";
	context.fillText("Game on pause", W/2, H/2);
}


function waiting (context, r1, r2) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "#FFFF00", true);

	context.shadowColor="#64218F";

	context.fillText("PING-PONG", W/2, H/10);

	textStyle(context, H/20, "#345");

	if (r1.state == null) {
		context.textAlign = "end";
		context.fillText("Ожидание первого игрока", W/2-W/20, H/4);
	}

	if (r2.state == null) {
		context.textAlign = "start";
		context.fillText("Ожидание второго игрока", W/2+W/20, H/4);
	}

	if (r1.state == "connected") {
		context.textAlign = "end";
		context.fillText(r1.pName + " подключен", W/2-W/20, H/4);
	}

	if(r2.state == "connected") {
		context.textAlign = "start";
		context.fillText(r2.pName + " подключен", W/2+W/20, H/4);
	}

	if (r1.state == "unready") {
		context.textAlign = "end";
		context.fillText(r1.pName + " не готов", W/2-W/20, H/4);
	}

	if(r2.state == "unready") {
		context.textAlign = "start";
		context.fillText(r2.pName + " не готов", W/2+W/20, H/4);
	}

	if (r1.state == "ready") {
		context.textAlign = "end";
		context.fillText(r1.pName + " готов", W/2-W/20, H/4);
	}

	if (r2.state == "ready") {
		context.textAlign = "start";
		context.fillText(r2.pName + " готов", W/2+W/20, H/4);
	}

}

function ready (context, r1, r2) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	r1.draw(context);
	r2.draw(context);

	textStyle(context, H/10, "#345");
	context.fillText("Press ready to start the game", W/2-W/4, H/2-H/20);
}

function count (context, ball, r1, r2, callback) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "#5B5CE5", true);

	setTimeout(function() {
		context.fillText("3", W/3, H/3);

		ball.draw(context);
		r1.draw(context);
		r2.draw(context);
	}, 1000);
	setTimeout(function() {
		textStyle(context, H/10, "#5B5CE5", true);

		context.fillText("2", W/3+W/10, H/3);
	}, 2000);
	setTimeout(function() {
		context.fillText("1", W/3+W/5, H/3);
	}, 3000);
	setTimeout(function() {
		callback.call();
	}, 4000);

}

function startScreen (context, r1, r2) {
	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "#FFFF00", true);

	context.fillText("PING-PONG", W/2, H/10);
}

function gameOver (context, text) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/10, "#C90707", true);

	context.textBaseline = "bottom";
	context.fillText("Игра закончена", W/2, H/2);
	context.textBaseline = "top";
	context.fillText(text, W/2, H/2+H/15);
}

function textStyle(context, size, color, shadow) {

	context.font = size+"px Verdana";
	context.textAlign = "center";
	context.textBaseline = "top";
	context.fillStyle = color;

	if(shadow == true){
		context.shadowColor="#372244";
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.shadowBlur = 5;
	} else {
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
	}

}

function random () {
	if(Math.floor(Math.random()*2) == 0) return 1;
		else return -1;
}
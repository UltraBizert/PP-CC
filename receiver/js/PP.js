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

	this.update = function (player1, player2){
		this.p1 = player1 || this.p1;
		this.p2 = player2 || this.p2;
	}

	this.draw = function () {

		ground(this.context);
		this.r1.draw(this.context);
		this.r2.draw(this.context);
		this.ball.draw(this.context);

		update(this.context,this.game, 
						this.p1,
						this.p2,
						this.ball.score);
	};

	this.main = function (gameStage, paddles) {

		switch (gameStage){

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
		break;

		case "End game":
			stop();


			if(this.game.type == 'opponents'){

				if(this.r1.score>=5) {
					gameOver(this.context, "Победил "+this.p1.pName);

				} else if(this.r2.score>=5) {
					gameOver(this.context, "Победил "+this.p2.pName);
				}

			} else if(this.game.type == 'friends') {

				if (this.r1.score!=0 || this.r2.score!=0) {
					gameOver(this.context, "Вы набрали "+this.ball.score+" очков");
				}
			}

			this.r1.clean();
			this.r2.clean();
			this.ball.clean();

			ctx = this.context;
			player1 = this.p1;
			player2 = this.p2;

			setTimeout(function() {
				waiting(ctx, player1, player2);
			}, 5000);
		break;
		}
	};

}

function Ball () {

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

	this.clean = function () {
		this.x = W/2;
		this.y = H/2;
		this.vx = W/300 * random();
		this.vy = H/100 * random();
		this.score = 0;
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
				if(this.x >= 0) this.x-= W/60;
			break;
			case "right":
				if(this.x <= W-this.w)this.x += W/60;
			break;
			}
		}
	}

	this.clean = function () {
		this.x = W/2 - this.w/2;
		this.score = 0;
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
		if(ball.y+ball.r>H){
			ball.vy=-ball.vy;
			ball.y=H-ball.r;
			r2.score++;
			spdUp(r1.score, r2.score, ball);
		}
		else if(ball.y<0){
			ball.vy=-ball.vy;
			ball.y=ball.r;
			r1.score++;
			spdUp(r1.score, r2.score, ball);
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

function update(context, game, player1, player2, score) {

	textStyle(context, H/35, "white");
	r1 = player1.paddle;
	r2 = player2.paddle;

	if(game.type == 'opponents'){
		context.fillText(r2.score, W/2, H/2-r2.y/4);
		context.fillText(r1.score, W/2, H/2+r2.y/4);

		if(r1.score>=5) {
			game.stage = "End game";
		} else if(r2.score>=5) {
			game.stage = "End game";
		}

	} else if (game.type == 'friends') {
		context.fillText( score, W/2, H/2);

		if (r1.score!=0 || r2.score!=0) {
			game.stage = "End game";
		}

	}
}

function spdUp (score1, score2, ball) {
	score = score1 + score2;

	console.log("x:"+ball.vx);
	console.log("y:"+ball.vy);

	if(score % 2 === 0){
		ball.vx += (ball.vx > 0) ? 0.5 :-0.5;
		ball.vy += (ball.vy > 0) ? 1 :-1;
	}

	if(ball.score % 2 === 0){
		ball.vx += (ball.vx > 0) ? 0.5 :-0.5;
		ball.vy += (ball.vy > 0) ? 1 :-1;
	}
}

function pause (context) {
	textStyle(context, H/10, "#3B518F", true);
	context.textBaseline = "bottom";
	context.fillText("Game on pause", W/2, H/2);
}


function waiting (context, p1, p2) {

	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);
	context.fillStyle = '#F3D8D8';
	context.fillRect(W/2, H/4, H/500, H-H/2);

	textStyle(context, H/5, "#515CDA", true);
	context.textBaseline = "bottom";

	context.fillText("PING-PONG", W/2, H/4);

	textStyle(context, H/10, "#345");
	context.textBaseline = "top";

	if (p1.state == null) {
		context.fillText("Первый игрок", W/4, H/4);
		// context.textAlign = "end";
		context.fillText("ожидание ", W/4, H/2);
	}

	if (p2.state == null) {
		context.fillText("Второй игрок", W-W/4, H/4);
		// context.textAlign = "start";
		context.fillText("ожидание ", W-W/4, H/2);
	}

	if (p1.state == "connected") {
		context.fillText(p1.pName, W/4, H/4);
		// context.textAlign = "end";
		context.fillText("подключен", W/4, H/2);
	}

	if(p2.state == "connected") {
		context.fillText(p2.pName, W-W/4, H/4);
		// context.textAlign = "start";
		context.fillText("подключен", W-W/4, H/2);
	}

	if (p1.state == "unready") {
		context.fillText(p1.pName, W/4, H/4);
		// context.textAlign = "end";
		context.fillText("не готов", W/4, H/2);
	}

	if(p2.state == "unready") {
		context.fillText(p2.pName, W-W/4, H/4);
		// context.textAlign = "start";
		context.fillText("не готов", W-W/4, H/2);
	}

	if (p1.state == "ready") {
		context.fillText(p1.pName, W/4, H/4);
		// context.textAlign = "end";
		context.fillText("готов", W/4, H/2);
	}

	if (p2.state == "ready") {
		context.fillText(p2.pName, W-W/4, H/4);
		// context.textAlign = "start";
		context.fillText("готов", W-W/4, H/2);
	}

}

function ready (context, r1, r2) {

	ground (context);

	r1.draw(context);
	r2.draw(context);

	textStyle(context, H/10, "#345");
	context.fillText("Press ready to start the game", W/2-W/4, H/2-H/20);
}

function count (context, ball, r1, r2, callback) {

	ground (context);

	textStyle(context, H/5, "#5B5CE5", true);

	setTimeout(function() {
		context.fillText("3", W/3, H/3);

		ball.draw(context);
		r1.draw(context);
		r2.draw(context);
	}, 1000);
	setTimeout(function() {
		textStyle(context, H/5, "#5B5CE5", true);

		context.fillText("2", W/2, H/3);
	}, 2000);
	setTimeout(function() {
		context.fillText("1", W-W/3, H/3);
	}, 3000);
	setTimeout(function() {
		callback.call();
	}, 4000);

}

function startScreen (context, r1, r2) {
	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);

	textStyle(context, H/4, "#515CDA", true);

	// var gradient = context.createLinearGradient(0, 0, 1000, 1000);
	// gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
	// gradient.addColorStop(0.15, "rgba(255, 255, 0, 1)");
	// gradient.addColorStop(0.3, "rgba(0, 255, 0, 1)");
	// gradient.addColorStop(0.5, "rgba(0, 255, 255, 1)");
	// gradient.addColorStop(0.65, "rgba(0, 0, 255, 1)");
	// gradient.addColorStop(0.8, "rgba(255, 0, 255, 1)");
	// gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
	// change composite so source is applied within the shadow-blur
	// context.globalCompositeOperation = "source-atop";
	// apply gradient to shadow-blur
	// context.fillStyle = gradient;

	context.shadowColor="#372244";
	context.shadowOffsetX = 8;
	context.shadowOffsetY = 8;
	context.shadowBlur = 5;

	context.fillText("PING-PONG", W/2, H/2);


}

function gameOver (context, text) {

	textStyle(context, H/10, "#C90707", true);

	context.textBaseline = "bottom";
	context.fillText("Игра закончена", W/2, H/2);
	context.textBaseline = "top";
	context.fillText(text, W/2, H/2+H/15);
}

function ground (context) {
	context.fillStyle = '#272';
	context.fillRect(0,0,W,H);
	context.fillStyle = '#F3D8D8';
	context.fillRect(0, H/2, W, H/170);

	// context.fillRect(0, 0, W, H/100);
	// context.fillRect(0, 0, H/100, H);
	// context.fillRect(0, H-H/100, W, H/100);
	// context.fillRect(W-H/100,0, W, H);
}

function textStyle(context, size, color, shadow) {

	context.font = size+"px Verdana";
	context.textAlign = "center";
	context.textBaseline = "center";
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
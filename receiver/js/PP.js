ctx.font = "18px Arial, sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

window.addEventListener("keydown", doKeyDown, false);
window.addEventListener("keyup", doKeyUp, false);

// paddles.push(new Paddle("bottom"));
// paddles.push(new Paddle("top"));



// p1 = paddles[1];
// p2 = paddles[2];

// ball = {
	
// 	draw: function() {
// 		ctx.beginPath();
// 		ctx.fillStyle = this.c;
// 		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
// 		ctx.fill();
// 	},
// 	move: function () {
// 		this.x += this.vx;
// 		this.y += this.vy;
// 	}
// };

start = {
	w: 100,
	h: 50,
	x: W/2-50,
	y: H/2-25,

	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.fillStlye = "white";
		ctx.fillText("First", W/2, H/2 );
	}
};

second = {
	w:100,
	h: 50,
	x: W/2+60,
	y: H/2-25,

	draw: function () {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x,this.y, this.w, this.h);
		ctx.fillStlye = "white";
		ctx.fillText("Second",this.x+50,this.y+25);
	}
};

pause = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,
	state: false,
	draw: function() {
		ctx.fillStlye = "white";
		ctx.fillText('pause', W/2-15, H/2-25);
	},
	time: function () {
		ctx.fillStyle = "white";
		ctx.fillText(3, W/2, H/2);
		
		cancelRequestAnimFrame(init);

		window.setTimeout(function(){
			ctx.fillStyle = "green";
			ctx.fillText(3, W/2, H/2);
			ctx.fillStyle = "white";
			ctx.fillText(2, W/2, H/2); 
		}, 500);
		window.setTimeout(function(){
			ctx.fillStyle = "green";
			ctx.fillText(2, W/2, H/2);
			ctx.fillStyle = "white";
			ctx.fillText(1, W/2, H/2); 
		}, 1000);
		window.setTimeout(function(){
			ctx.fillStyle = "green";
			ctx.fillText(1, W/2, H/2);
			animation();
		}, 1500);
	},
};

restart = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,

	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.fillStlye = "white";
		ctx.fillText("Restart", W/2, H/2 - 25 );
	}
};

window.requestAnimFrame = (function(){
return  window.RequestAnimationFrame || 
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
return  window.CancelRequestAnimationFrame ||
		clearTimeout
} )();

function createBall () {

	this.x = W/2,
	this.y = H/2, 
	this.r = 5,
	this.c = "red",
	this.vx = W/300 * random(),
	this.vy = H/100 * random();
	this.cr = 'rgb('+
		Math.floor(Math.random()*256)+','+
		Math.floor(Math.random()*256)+','+
		Math.floor(Math.random()*256)+')';

	this.draw = function (context) {
		context.beginPath();
		context.fillStyle = 'rgb('+
		Math.floor(Math.random()*256)+','+
		Math.floor(Math.random()*256)+','+
		Math.floor(Math.random()*256)+')';//'hsl(' + 360 * Math.random() + ', 40%, 40%)';
		context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		context.fill();
	};

	this.move = function () {
		this.x += this.vx*3;
		this.y += this.vy*3;
	}
};

function Playground (context) {
	this.context = context || undefined;

	this.init = function (paddles, ball) {
		this.paddles = paddles || [];
		this.ball = ball || {};
	}

	this.draw = function (context) {
		this.context.fillStyle = '#272';
		this.context.fillRect(0,0,W,H);
		this.paddles[0].draw(this.context);
		this.paddles[1].draw(this.context);
		this.ball.draw(this.context);
	};

	this.main = function () {
		this.ball.move();
		checkCollides(this.ball, this.paddles);
	}
	// this.startAnimation = function (init) {
	// 	if(init) cancelRequestAnimFrame(init);
	// 	init = requestAnimFrame(this.startAnimation);
	// 	this.draw();
	// };

	// this.stopAnimation = function (anim) {
	// 	if(anim) {
	// 		cancelRequestAnimFrame(anim);
	// 		return 'Animation stopped';
	// 	}
	// 	return undefined;
	// };
};
// function animation() {
// 	if(init) cancelRequestAnimFrame(init);
// 	init = requestAnimFrame(animation);
// 	draw();
// };



function draw() {	
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
	}
	ball.draw();
	update();
};

function Paddle(pos) {

		this.h = 20;
		this.w = 1050;
		this.x = W/2-this.w/2;
		this.y = (pos == "top") ? 0 : H-this.h;
		this.scoreY = (pos == "top")
		this.score = 0;

	this.draw = function (context) {
		context.fillStyle = "white";
		context.fillRect(this.x, this.y, this.w, this.h);
	}
};

function score (type, paddle) {
	paddle = paddle || null;
	if(type == gameTypes.opponents) {
		paddle.score++;
	} else if (type == gameTypes.friends && paddle == null) {
		game.score++;
	} else if (type ==gameTypes.friends && paddle !==null) gameOver();
}

function checkCollides (ball, paddles) {
	p1 = paddles[0];
	p2 = paddles[1];

	if(collides(ball, p1)) {
		collideAction(ball, p1);
		score(game.type);
	}
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
		score(game.type);
	}
	else {
		increaseSpd(p1.score+p2.score);
		if(ball.y + ball.r > H) {
			ball.y = H/2;
			ball.x = W/2;
			score (game.type, p2);
		}
		else if(ball.y < 0) {
			ball.y = H/2;
			ball.x = W/2;
			score(game.type, p1);
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
};

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
};

function collideAction(ball, p) {
	ball.vy = -ball.vy;

	if(paddleHit == 1) {
		ball.y = p.y - p.h;
	}

	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
	}
};

function increaseSpd(score) {
	// if((score/2) % 4 == 0) {
	//     if(Math.abs(ball.vx) < 5) {
	//         ball.vx += (ball.vx < 0) ? -1 : 1;
	//         ball.vy += (ball.vy < 0) ? -2 : 2;
	//     }
	// }
};

function doKeyDown (e) {

	if (e.keyCode === 65) key.left = true;
	 else if (e.keyCode === 68)  key.right = true;

	if(e.keyCode === 37) key.aleft = true;
	 else if (e.keyCode === 39) key.aright = true;
	
	if(e.keyCode == 80) {
		if(pause.state === false) pause.state=true;
		 else pause.state = false;
	}    

	if (e.keyCode == 82) {
		key.restart = true;
		game.stage = gameStages.round;
	}
};

function doKeyUp (e) {

	if (e.keyCode === 65) key.left = false;
	 else if (e.keyCode === 68) key.right = false;	

	if(e.keyCode === 37) key.aleft = false;
	 else if (e.keyCode === 39) key.aright = false;
	 
};

function update() {

	updateScore(game.type, p2, p1);    

	// if(playerData.player.move === true && playerData.player.direction === "left" && p1.x>=0) p1.x-=15;
		// else if (playerData.player.move === true && playerData.player.direction === "right" && p1.x <= W-p1.w) p1.x+=15;

	console.log(p1.x);
		
	if (key.left == true && p2.x>=0) p2.x -= 15;
		 else if (key.right == true && p2.x<=W-p2.w) p2.x += 15;

	if (key.restart == true) {
		p1.score = 0;
		p2.score = 0;
		game.score = 0;
		ball.x = W/2;
		ball.y = H/2;
		ball.vx = ball.vx * random();
		ball.vy = ball.vy * random();
		key.restart = false;
		pause.time();
	}

	if (pause.state === false) {

		ball.move();

	
		
} else pause.draw();
};


function updateScore(type, paddles1, paddles2) {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	if(type == 'opponents'){
		ctx.fillText( paddles1.score, W/2, H/2-paddles2.y/4 );
		ctx.fillText( paddles2.score, W/2, H/2+paddles2.y/4 );
	} else if (type == 'friends') {
		ctx.fillText( game.score, W/2, H/2);
	}
};

function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored points!", W/2, H/2 - 25 );
	game.stage = gameStages.endgame;
	cancelRequestAnimFrame(init);
	main();
};

function random () {
	if(Math.floor(Math.random()*2) == 0) return 1;
		else return -1;
};

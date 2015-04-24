var canvas = document.getElementById("playground"),
	ctx = canvas.getContext("2d"),
	W = window.innerWidth,
	H = window.innerHeight,
	paddles = [],
	ball = {},
	init,
	gameStages = {
	waiting: "Waiting",
	ready: "Ready",
	round: "Round",
	pause: "Pause",
	endRound: "End round",
	endGame: "End game"
	},
	gameTypes = {
		opponents: "opponents",
		friends: "friends"
	},
	game = {
		type: gameTypes.friends,
		stage: gameStages.round,
		score: 0,
	};
	// particles = [],
	// key = {},
	//paddleHit,

$(window).load(function() {
	$("#loading").fadeOut(500);

var animation = function (pg) {
	if(init) cancelRequestAnimFrame(init);
	init = requestAnimFrame(animation);
	this.pg.main();
	this.pg.draw();
};

canvas.width = W;
canvas.height = H;

paddles.push(new Paddle('top'));
paddles.push(new Paddle('bot'));

ball = new createBall();

pg = new Playground(ctx);

pg.init(paddles, ball);
// pg.startAnimation(init);
animation();
})


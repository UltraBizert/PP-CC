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
		type: gameTypes.opponents,
		stage: gameStages.round,
		score: 0,
	};

$(window).load(function() {
	$("#loading").fadeOut(500);


var animation = function () {
	if(init) cancelRequestAnimFrame(init);
	init = requestAnimFrame(animation);
	this.pg.main();
	this.pg.draw();
};

ctx.font = "18px Arial, sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

canvas.width = W;
canvas.height = H;

paddles.push(new createPaddle(1));
paddles.push(new createPaddle(2));

ball = new createBall();

pg = new Playground(ctx);

pg.init(paddles, ball, game.type);
// pg.startAnimation(init);
animation();
});

function Player (senderID, number) {
	this.id = senderID || undefined;
	this.number = number || null;
	this.paddle = new createPaddle(number);
	this.score = 0;
}
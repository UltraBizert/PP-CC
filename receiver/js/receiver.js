var canvas = document.getElementById("playground"),
	ctx = canvas.getContext("2d"),
	W = window.innerWidth,
	H = window.innerHeight,
	players = [],	
	paddles = [],
	ball = {},
	init,
	requestId = 0,
	gameStages = {
		waiting: "Waiting",
		ready: "Ready",
		round: "Round",
		pause: "Pause",
		endRound: "End round",
		endGame: "End game",
	},
	playerState = {
		connected : "connected",
		ready : "ready",
		inGame : "inGame",
	}
	gameTypes = {
		opponents: "opponents",
		friends: "friends",
	},
	game = {
		type: gameTypes.friends,
		stage: null,
	},
	mBus = {
		game:null,
		player1:null,
		player2:null,
		message:null,
		update: function () {

		}
	};

window.onload = function() {

canvas.width = W;
canvas.height = H;

players.push( new Player(null, 1));
players.push( new Player(null, 2));


	cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	// console.log('Starting Receiver Manager');
	
	// handler for the 'ready' event
	castReceiverManager.onReady = function(event) {
		// console.log('Received Ready event: ' + JSON.stringify(event.data));
		window.castReceiverManager.setApplicationState("Application status is ready...");
	};
	
	// handler for 'senderconnected' event
	castReceiverManager.onSenderConnected = function(event) {
		// console.log('Received Sender Connected event: ' + event.data);
		// console.log(window.castReceiverManager.getSender(event.data).userAgent);
		if (window.castReceiverManager.getSenders().length == 1) {
			startScreen(ctx);
		}
	};
	
	// handler for 'senderdisconnected' event
	castReceiverManager.onSenderDisconnected = function(event) {
		console.log('Received Sender Disconnected event: ' + event.data);
		if (window.castReceiverManager.getSenders().length == 0) {
			window.close();
		}
	};
	
	// handler for 'systemvolumechanged' event
	castReceiverManager.onSystemVolumeChanged = function(event) {
		// console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
				// event.data['muted']);
	};

	// create a CastMessageBus to handle mBus for a custom namespace
	window.messageBus =
		window.castReceiverManager.getCastMessageBus('urn:x-cast:ping-pong');

	// handler for the CastMessageBus message event
	window.messageBus.onMessage = function(event) {
		//console.log('Message [' + event.senderId + ']: ' + event.data);
		// display the message from the sender

		data = JSON.parse(event.data);
		console.log(window.castReceiverManager.getSenders().length);
		
		switch(data.messag) {
			case "connect":
				if(players[0].id === null) {

					players[0] = new Player(event.senderId, 1);
					players[0].state = "connected";

					game.stage = gameStages.waiting;
					waiting(ctx, players[0].state, players[1].state);

					mBusUpdate("You connected like player 1", game, players[0]);
					window.messageBus.send(event.senderId, JSON.stringify(mBus));

				}else if (players[1].id === null && event.senderId !== players[0].id){

					players[1] = new Player(event.senderId, 2);
					players[1].state = "connected";

					game.stage = gameStages.ready;
					waiting(ctx, players[0].state, players[1].state);

					mBusUpdate("You connected like player 2", game, players[1]);
					window.messageBus.send(event.senderId, JSON.stringify(mBus));

				}else {

					mBusUpdate("Game full", null, null);
					window.messageBus.send(event.senderId, JSON.stringify(mBus));
				}

			break;

			case "ready":
				if(event.senderId === players[0].id) {
					players[0].state = "ready";
					waiting(ctx, players[0].state, players[1].state);
					console.log("Player 1 ready");
				} else if (event.senderId === players[1].id){
					players[1].state = "ready";
					waiting(ctx, players[0].state, players[1].state);
					console.log("Player 2 ready");
				}
			break;
			case "game":
				if(players[1].state === "ready" && players[0].state === "ready") {
					ball = new createBall();
					pg = new Playground(ctx);
					game.stage = gameStages.round;
					pg.init(players[0].paddle, players[1].paddle, ball, game);
					start();
					mBus.game = game;
					console.log("Game started");
				}else {
					console.log(mBus.game.stage);
					mBus.message = "Waiting for confirmation of readiness players.";
					window.messageBus.send(event.senderId, JSON.stringify(mBus));
				}
			break;
			case "move":
				if(game.stage == gameStages.round){
					if(event.senderId == players[0].id){
						players[0].paddle.move(data.paddle);
						console.log(players[0].paddle.x);
					} else if(event.senderId == players[1].id){
						players[1].paddle.move(data.paddle);
						console.log(players[1].paddle.x);
					}
				}
			break;
			case "pause":
				if(game.stage === gameStages.round) game.stage=gameStages.pause;
					else if(game.stage === gameStages.pause){
						start();
						game.stage = gameStages.round;
					}
				console.log(game.stage);
			break;
			case "exit":

				if(event.senderId === players[0].id) {

					mBus.game.stage = null;
					window.messageBus.send(event.senderId, JSON.stringify(mBus));

					game.stage = gameStages.waiting;

					players[0].out();

					console.log("Player 1 out");

					waiting(ctx, players[0].state, players[1].state);

					if(players[1].id === null) window.close(); //close app

				} else if (event.senderId === players[1].id){

					mBus.game.stage = null;
					window.messageBus.send(event.senderId, JSON.stringify(mBus));

					game.stage = gameStages.waiting;

					players[1].out();
					console.log("Player 2 out");

					waiting(ctx, players[0].state, players[1].state);

					if(players[0].id === null) window.close(); //close app
				}

			break;
		}//end switch

		console.log(players);
		// inform all senders on the CastMessageBus of the incoming message event
		// sender message listener will be invoked
		// window.messageBus.send(event.senderId, event.data);
	}

	// initialize the CastReceiverManager with an application status message
	window.castReceiverManager.start({statusText: "Application is starting"});
	// console.log(event.data);
};

function Player (senderID, number) {
	this.id = senderID || null;
	this.number = number || null;
	this.paddle = new Paddle(number);
	this.state = null;
	this.score = 0;

	this.out = function () {
		this.id = null;
		this.number = null;
		this.paddle = null;
		this.state = null;
		this.score = 0;
	}
}

function animate(time) {
	requestId = window.requestAnimationFrame(animate);
	pg.main(game.stage);
}
function start() {
	animationStartTime = Date.now();
	requestId = window.requestAnimationFrame(animate);
}
function stop() {
	if (requestId)
	window.cancelAnimationFrame(requestId);
	requestId = 0;
}

function mBusUpdate (message, game, player) {
	mBus.message = message;
	mBus.game = game;
	mBus.player = player;
}
var canvas = document.getElementById("playground"),
	ctx = canvas.getContext("2d"),
	W = window.innerWidth,
	H = window.innerHeight,
	players = [],
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
	};

window.onload = function() {

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


	/*cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	console.log('Starting Receiver Manager');
	
	// handler for the 'ready' event
	castReceiverManager.onReady = function(event) {
		console.log('Received Ready event: ' + JSON.stringify(event.data));
		window.castReceiverManager.setApplicationState("Application status is ready...");
	};
	
	// handler for 'senderconnected' event
	castReceiverManager.onSenderConnected = function(event) {
		console.log('Received Sender Connected event: ' + event.data);
		console.log(window.castReceiverManager.getSender(event.data).userAgent);
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
		console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
				event.data['muted']);
	};

	// create a CastMessageBus to handle messages for a custom namespace
	window.messageBus =
		window.castReceiverManager.getCastMessageBus('urn:x-cast:ping-pong');

	// handler for the CastMessageBus message event
	window.messageBus.onMessage = function(event) {
		//console.log('Message [' + event.senderId + ']: ' + event.data);
		// display the message from the sender

		data = JSON.parse(event.data);

		switch(data.messag) {
			case "connect":
				if(players[0] === undefined) {
					players.push(new Player(event.senderId, 1));
					window.messageBus.send(event.senderId, "You connected like player 1" );
				}else if (players[1] === undefined && event.senderId !== players[0].id){
				 players.push(new Player(event.senderId, 2));
				 window.messageBus.send(event.senderId, "You connected like player 2" );
				}else window.messageBus.send(event.senderId, "Game full" );
			break;
			case "game":
			if(players[1] !== undefined) {
				ball = new createBall();
				pg = new Playground(ctx);
				pg.init(players[0].paddle, players[1].paddle, ball, game);
				animation(pg);
			}else window.messageBus.send(event.senderId, "Waiting player two");
			break;
			case "move":
				if(event.senderId == players[0].id){
					players[0].paddle.move(data.paddle);
				} else if(event.senderId == players[1].id){
					players[1].paddle.move(data.paddle);
				} 
			break;
		}

		console.log(players);
		// inform all senders on the CastMessageBus of the incoming message event
		// sender message listener will be invoked
		// window.messageBus.send(event.senderId, event.data);
	}

	// initialize the CastReceiverManager with an application status message
	window.castReceiverManager.start({statusText: "Application is starting"});
	console.log(event.data);*/
};

function Player (senderID, number) {
	this.id = senderID || undefined;
	this.number = number || null;
	this.paddle = new createPaddle(number);
	this.score = 0;
}
var data = {game:{type:'opponents', stage:'round'}},
	players = [];
window.onload = function() {
	cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
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
		window.castReceiverManager.getCastMessageBus('urn:x-cast:com.google.cast.sample.helloworld');

	// handler for the CastMessageBus message event
	window.messageBus.onMessage = function(event) {
		//console.log('Message [' + event.senderId + ']: ' + event.data);
		// display the message from the sender

		data = JSON.parse(event.data);
		console.log(players[0]);
		console.log(data.messag);

		switch(data.messag) {
			case "connect":
				if(players[0] === undefined) {
					players.push(new Player(event.senderId, 1));
					window.messageBus.send(event.senderId, "You connected like player 1" );
				}else if (players[1] === undefined && event.senderId !== players[0].id){
				 players.push(new Player(event.senderId, 2));
				 window.messageBus.send(event.senderId, "You connected like player 2" );
				}
				else window.messageBus.send(event.senderId, "Game full" );
			break;
			case "move":
				if(event.senderId == players[0].id){
					players[0].paddle.move(data.paddle.move, data.paddle.direction);
				} else if(event.senderId == players[1].id){
					players[1].paddle.move(data.paddle.move, data.paddle.direction);
				} 
			break;
		}

		console.log(players);
		// inform all senders on the CastMessageBus of the incoming message event
		// sender message listener will be invoked
		window.messageBus.send(event.senderId, event.data);
	}

	// initialize the CastReceiverManager with an application status message
	window.castReceiverManager.start({statusText: "Application is starting"});
	console.log(event.data);
};

	// utility function to display the text message in the input field
	function displayText(text) {
		console.log(text);
		data = text;
		window.castReceiverManager.setApplicationState(text);
	};

	function message (mess) {
		window.messageBus.send(event.senderId, mess);
	}



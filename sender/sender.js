var applicationID = '664F7F25';
var namespace = 'urn:x-cast:com.google.cast.sample.helloworld';
var session = null;

/**
 * Call initialization for Cast
 */
if (!chrome.cast || !chrome.cast.isAvailable) {
	setTimeout(initializeCastApi, 1000);
}

/**
 * initialization
 */
function initializeCastApi() {
	var sessionRequest = new chrome.cast.SessionRequest(applicationID);
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
		sessionListener,
		receiverListener);

	chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

/**
 * initialization success callback
 */
function onInitSuccess() {
	appendMessage("onInitSuccess");
}

/**
 * initialization error callback
 */
function onError(message) {
	appendMessage("onError: "+JSON.stringify(message));
}

/**
 * generic success callback
 */
function onSuccess(message) {
	appendMessage("onSuccess: "+message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
	appendMessage('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
	appendMessage('New session ID:' + e.sessionId);
	session = e;
	session.addUpdateListener(sessionUpdateListener);  
	session.addMessageListener(namespace, receiverMessage);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive) {
	var message = isAlive ? 'Session Updated' : 'Session Removed';
	message += ': ' + session.sessionId;
	appendMessage(message);
	if (!isAlive) {
		session = null;
	}
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
	appendMessage("receiverMessage: "+namespace+", "+message);
	console.log(message);
};

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
	if( e === 'available' ) {
		appendMessage("receiver found");
	}
	else {
		appendMessage("receiver list empty");
	}
}

/**
 * stop app/session
 */
function stopApp() {
	session.stop(onStopAppSuccess, onError);
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage(message) {
	
	if (session!=null) {
		session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
	}
	else {
		chrome.cast.requestSession(function(e) {
			session = e;
			session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
		}, onError);
	}
}

/**
 * append message to debug message window
 * @param {string} message A message string
 */
function appendMessage(message) {
	console.log(message);
	var dw = document.getElementById("debugmessage");
	dw.innerHTML += '\n' + JSON.stringify(message);
};

/**
 * utility function to handle text typed in by user in the input field
 */
function update() {
	sendMessage(document.getElementById("input").value);
}

/**
 * handler for the transcribed text from the speech input
 * @param {string} words A transcibed speech string
 */
function transcribe(words) {
	sendMessage(words);
}

window.addEventListener("keydown", doKeyDown, false);
window.addEventListener("keyup", doKeyUp, false);

var messages = { 

		game: {
			stage: null,
			type: null,
		},

		paddle: {
			move: false,
			direction: null,
		},

		messag: null,
	}

	//setInterval(function(){sendMessage(messages)},1000);
	function doKeyDown (e) {

		if (e.keyCode === 65){ 
			messages.player.move = true;
			messages.player.direction = "left";
			messages.messag = "move";
			sendMessage(messages);
		}
		else if (e.keyCode === 68){
			messages.paddle.move = true;
			messages.paddle.direction = "right";
			messages.messag = "move";
			sendMessage(messages);
		}

		if(e.keyCode == 80) {
			if(pause.state === false) pause.state=true;
			 else pause.state = false;
		}

		if (e.keyCode == 82) {
			key.restart = true;
			game.stage = gameStages.round;
		}

		if (e.keyCode == 83) {
			messages.messag = "connect";
			sendMessage(messages);
		}
};


function doKeyUp (e) {

		if (e.keyCode === 65) messages.paddle.move = false; 
		 else if (e.keyCode === 68) messages.paddle.move = false;
		sendMessage(messages);
}
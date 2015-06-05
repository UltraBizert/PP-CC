window.addEventListener("keydown", doKeyDown, false);
window.addEventListener("keyup", doKeyUp, false);

var	game=  {
			stage: null,
			type: null,
		},
	messages = { 
		paddle: {
			move: false,
			direction: null,
		},
		messag: null,
		pName : null,
		gType : null,
	},
	gameTypes = {
		opponents: "opponents",
		friends: "friends"
	};

var link = document.querySelector('link[rel=import]');
var content = link.import.querySelector('#main');

var applicationID = '06A159A5';
var namespace = 'urn:x-cast:ping-pong';
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
	console.log("onInitSuccess");
}

/**
 * initialization error callback
 */
function onError(message) {
	console.log("onError: "+JSON.stringify(message));
}

/**
 * generic success callback
 */
function onSuccess(message) {
	// console.log("onSuccess: "+message);
	console.log('this');
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
	console.log('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
	console.log('New session ID:' + e.sessionId);
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
	console.log(message);
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
	console.log("receiverMessage: "+namespace+", "+message);
	message = JSON.parse(message);
	game = message.game;
	player = message.player;

	console.log(game);

	if(game.stage != null)
	{
		document.querySelector('#major').style.display = "none";
		if (document.querySelector('#main')){
			document.querySelector('#main').style.display = "block";
		} else {
			document.body.appendChild(content.cloneNode(true));
		}
		document.querySelector('#stage').innerHTML = game.stage;
		document.querySelector('#state').innerHTML = player.state;
		document.querySelector('#paddle').innerHTML = player.paddle.position;
		document.querySelector('#pName').innerHTML = document.getElementById("name").value;
	} else {
		document.querySelector('#major').style.display = "block";
		document.querySelector('#main').style.display = "none";
	}
};

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
	if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
		console.log("receiver found");
	}
	else {
		console.log("receiver list empty");
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
	console.log(message);
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
// function console.log(message) {
// 	console.log(JSON.parse(message));
// };

/**
 * utility function to handle text typed in by user in the input field
 */
function update() {
	sendMessage(document.getElementById("input").value);
}

/**
 * handler for the transcribed text from the speech input
 * @param {string} words A transcibed speech string
 
function transcribe(words) {
	sendMessage(words);
}*/


function doKeyDown (e) {

	if (e.keyCode === 65){
		if(messages.paddle.direction !=="left")
			left();


	}else if (e.keyCode === 68){
		if(messages.paddle.direction !== "right")
			right();

	}
};


function doKeyUp (e) {

	if (e.keyCode === 65) {
		stopMove();
}
	if (e.keyCode === 68){
			stopMove();
	}
}

function connection () {

this.pName = document.getElementById("name").value;

	if(session !== null && pName !== "") {
		messages.pName = pName;
		messages.messag = "connect";
		sendMessage(messages);

	} else alert("Выберете Chromecast и введите имя!");
}

function left () {
	messages.paddle.move = true;
	messages.paddle.direction = "left";
	messages.messag = "move";
	sendMessage(messages);
}

function right () {
	console.log("1");
	messages.paddle.move = true;
	messages.paddle.direction = "right";
	messages.messag = "move";
	sendMessage(messages);
}

function stopMove () {
	messages.paddle.move = false;
	messages.paddle.direction = "";
	messages.messag = "move";
	sendMessage(messages);
}

function pause () {
	messages.messag = "pause";
	sendMessage(messages);
}

function start (){
	this.gType = document.getElementById("type").value;
	console.log(gType);
	messages.gType = gType;
	messages.messag = "game";
	sendMessage(messages);
}

function ready () {
	if(document.getElementById("btnReady").value === "Ready") {
		messages.messag = "ready";
		document.getElementById("btnReady").value = "Unready";
	} else if(document.getElementById("btnReady").value === "Unready") {
		messages.messag = "unready";
		document.getElementById("btnReady").value = "Ready";
	}
	sendMessage(messages);
}

function exit () {
	messages.messag = "exit";
	sendMessage(messages);
}
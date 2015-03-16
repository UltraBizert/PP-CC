var applicationID ='664F7F25',
        namespace = 'urn:x-cast:ping-pong',
        session = null;

$( document ).ready (function () {
    var loadCastInterval = setInterval (function () {
        if (chrome.cast.isAvailable) {
            console.log('Cast loaded');
            clearInterval(loadCastInterval);
            InitializeCastAPI();
        } else {
            console.log('Unavailible');
        }
    }, 1000);
});

$('#castme').click(function () {
    launchApp();
});

function launchApp () {
    console.log('Launching the chromecast appication ...');
    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}
function onRequestSessionSuccess (e) {
    console.log('Succissfully created session' + e.sessionId);
    session = e;
}

function onLaunchError () {
    console.log('Error connecting to the cromecast');
}

function InitializeCastAPI(){
    var sessionRequest = new chrome.cast.SessionRequest(applicationID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
    chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
} 

function sessionListener (e) {
    session = e;
    console.log('Session new');
    if (session.media.lenght != 0) {
        console.log('Found'+ session.media.length + 'sessions.');
    }
}


function receiverListener(e) {
    if( e === 'available' ) {
        console.log("Chromecast was found on the network.");
    }
    else {
        console.log("There are no Chromecasts available.");
    }
}

function onInitSuccess() {
    console.log("Initialization succeeded");
}

function onInitError() {
    console.log("Initialization failed");
}
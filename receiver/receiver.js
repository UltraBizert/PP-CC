// window.onload  = function () {

//     cast.receiver.logger.setLevelValue(0);
//     window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

//     castReceiverManager.onSenderConnected = function(event) {

//     console.log('Received Sender Connected event: ' + event.data);
    
//     };
    
//     castReceiverManager.onSenderDisconnected = function(event) {

// 		console.log('Received Sender Disconnected event: ' + event.data);
// 		if (window.castReceiverManager.getSenders().length == 0) {
// 			window.close();
// 		}
    
//     };
    
//     window.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:ping-pong');
    
//     window.messageBus.onMessage = function(event) {

//         console.log('Received "' + event.data + '" from player!');
        
//     };
// };
var playerData = {game:{type:'opponents', stage:'round'}};
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
          playerData = JSON.parse(event.data);
          console.log(playerData.game.stage);
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
        playerData = text;
        window.castReceiverManager.setApplicationState(text);
      };

      function message (mess) {
        window.messageBus.send(event.senderId, mess);
      }



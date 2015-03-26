window.onload  = function () {
            cast.receiver.logger.setLevelValue(0);
            window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        
            castReceiverManager.onSenderConnected = function(event) {
            console.log('Received Sender Connected event: ' + event.data);
            };
            
            castReceiverManager.onSenderDisconnected = function(event) {
		console.log('Received Sender Disconnected event: ' + event.data);
		if (window.castReceiverManager.getSenders().length == 0) {
			window.close();
		}
            };
            
            window.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:ping-pong');
            
            window.messageBus.onMessage = function(event) {
                console.log('Received "' + event.data + '" from player!');
            };
        
        };




    

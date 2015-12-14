/**
 * A middleware to track heartbeats of clients to detect disconnected clients
 * Active 'wake' && 'idle' server events
 * @param  {Tobacco} client
 * @param  {Smoker} server
 */
var heartbeats = module.exports = function(client, server){
	var rawClient = client.raw(),
		rawServer = server.raw();

	// track missing pongs
	rawClient.pongMissing = 0;

	// set pinger if not existing
	// @var int server.pinger
	if(server.pinger === null){
		// fire server's waking-up event
		server.emit('wake');

		server.pinger = setInterval(function pinger(){
			rawServer.clients.forEach(function(rawClient){
				if(rawClient.pongMissing > 2){
					rawClient.close();
				}
				else{
					rawClient.ping();
					rawClient.pongMissing++;
				}
			});

		}, 5000); // 5 seconds
	}

	// reset pongMissing counted
	rawClient.on('pong', function(){
		this.pongMissing = 0;
	});

	rawClient.on('close', function(){
		// when there isn't any clients to serve
		if(!rawServer.clients.length){
			clearInterval(server.pinger);
			server.pinger = null;

			// fire 'idle' event
			server.emit('idle');
		}
	});
}
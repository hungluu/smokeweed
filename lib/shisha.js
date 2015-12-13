/**
 * A ultimate tool for smoking weed
 */

var shisha = {
	/**
	 * Create a message bag
	 * @param  {string} title
	 * @param  {misc} contents
	 * @param  {string} from the unique name of a sender, '' if from server
	 * @return {string}
	 */
	msg : function(title, contents, from){
		return JSON.stringify({
			title : title,
			contents : contents,
			from : from || ''
		});
	},
	/**
	 * Bind events from ws client to weed
	 * @param  {Weed} client
	 */
	bind : function(client){
		var wsClient = client.channel[client.id];

		wsClient.on('message', function(data){
			var parsed = JSON.parse(data);

			client.emit(parsed.title, parsed.contents);
		});

		wsClient.on('close', function(){
			client.emit('close');
		});

		wsClient.on('pong', function(){
			client.emit('pong');
		});
	},
	/**
	 * Install heartbeats
	 * @param  {boolean} ping
	 * @param  {Weed} client
	 * @param  {Websocket} wsClient
	 */
	bindPing : function(ping, client, wsClient){
		if(ping){
			client.pongmissing = 0;

			var pinger = setInterval(function ping(){
				if(client.pongmissing > 3){
					wsClient.close();
				}
				else{
					wsClient.ping();
					client.pongmissing++;
				}
			}, 3000); // 3 seconds

			client.on('pong', function(){
				client.pongmissing = 0;
			});

			client.on('close', function(){
				clearInterval(pinger);
			});

			return true;
		}
		else
			return false;
	},
	bindName : function(named, client, wsClient){
		if(name){
			client.name = shisha.generateUIDNotMoreThan1million();

			return true;
		}
		else
			return false;
	},
	// @ref : http://stackoverflow.com/a/6248722/2443998
	generateName : function(){
	    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-5);
	},
	syncOptions : function(options, defaultOptions){
		for(var x in defaultOptions){
			if(typeof options[x] === 'undefined'){
				options[x] = defaultOptions[x];
			}
		}

		return options;
	},
	findClientByName : function(clients, name, callback){
		for(var i = clients.length - 1; i >= 0; i--){
			if(clients[i].weedName === name){
				callback(clients[i]);
			}
		};
	}
}

module.exports = shisha;
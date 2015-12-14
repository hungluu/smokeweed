var shisha = {};
shisha.generate = {
	// generate options
	options : function(customOptions, defaultOptions){
		for(var key in defaultOptions){
			if(typeof customOptions[key] === 'undefined'){
				customOptions[key] = defaultOptions[key];
			}
		}

		return customOptions;
	},
	// generate a random (highly unique) name with specified length
	name : function(length){
		return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-length);
	},
	// generate server with default port is 5000
	server : function(port){
		port = process.env.port || 5000;

		var server = require('http').createServer();
		server.listen(5000);

		return server;
	},
	// generate callbacks
	callback : {
		open : function(server, options){
			return function openCallback(rawClient){
				var client = new options.client(server.raw().clients, rawClient);

				server.emit('before', client, server);

				server.emit('open', client);
			}
		}
	},
	// create a message bag
	message : function(title, contents, from){
		return JSON.stringify({
			title : title,
			contents : contents,
			from : from
		});
	}
};

shisha.bind = {
	// bind heartbeats middleware
	heartbeats : function(option, server){
		if(option){
			server.use(require('./heartbeats'));
			return true;
		}
		else
			return false;
	},
	// bind naming-client functionality to Weed
	named : function(client){
		rawClient = client.raw();

		client.name = rawClient.weedName = shisha.generate.name(6);

		rawClient.send(shisha.generate.message('--init-name', client.name));
	},
	// bind necessary events for client
	client: function(client){
		// console.log('-----ID ' + client.id);
		var rawClient = client.channel[client.id];

		rawClient.on('message', function(data){
			var parsed = JSON.parse(data);
			client.mailbox.emit(parsed.title, parsed.contents, parsed.to);
		});

		rawClient.on('close', function(){
			client.emit('close');
		});

		rawClient.on('pong', function(){
			client.emit('pong');
		});
	}
}

// find a client by name with a callback
shisha.find = function(clients, name, callback){
	name = name || '';
	for(var i = clients.length - 1; i >= 0; i--){
		if(clients[i].weedName === name){
			callback(clients[i]);
		}
	}
}

module.exports = shisha;
var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	shisha = require('./shisha');

/**
 * A client
 * @param {Websocket} wsClient
 */
var Weed = function(clients, wsClient){
	EventEmitter.call(this);
	// a mailbox to receive messages
	this.mailbox = new EventEmitter();

	// channel contains list of users
	this.channel = clients;
	this.id = clients.indexOf(wsClient);
	var name = this.name = wsClient.weedName = shisha.generateName();

	wsClient.send(shisha.msg('init-name', name));

	shisha.bind(this);
}

util.inherits(Weed, EventEmitter);

Weed.prototype.read = function(title, callback){
	this.mailbox.on(title, callback);
}

Weed.prototype.write = function(title, contents, to){
	if(to){
		var sender = this.name;
		shisha.findClientByName(this.channel, to, function(client){
			client.send(shisha.msg(title, contents, sender));
		});
	}
	else
		this.raw().send(shisha.msg(title, contents));
}

Weed.prototype.broadcast =function(title, contents){
	for(var i = this.channel.length - 1; i >= 0;i--){
		if(i !== this.id){
			this.channel[i].send(shisha.msg(title, contents, this.name));
		}
	}
}

Weed.prototype.raw = function(){
	return this.channel[this.id];
}

module.exports = Weed;
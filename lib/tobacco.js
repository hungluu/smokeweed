var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	shisha = require('./shisha');

/**
 * A client
 * @param {Websocket} wsClient
 */
var Tobacco = function(clients, wsClient){
	EventEmitter.call(this);
	this.messenger = new EventEmitter();

	this.channel = clients;
	this.id = clients.indexOf(wsClient);
	// this.name = '';

	shisha.bind(this);
}

util.inherits(Tobacco, EventEmitter);

Tobacco.prototype.read = function(title, callback){
	this.messenger.on(title, callback);
}

Tobacco.prototype.write = function(title, contents){
	this.channel[this.id].send(shisha.msg(title, contents));
}

Tobacco.prototype.broadcast =function(title, contents){
	for(var i = this.channel.length - 1; i >= 0;i--){
		if(i !== this.id){
			this.channel[i].send(shisha.msg(title, contents));
		}
	};
}

module.exports = Tobacco;
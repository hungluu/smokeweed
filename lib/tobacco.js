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
	this.raw().send(shisha.msg(title, contents));
}

Tobacco.prototype.broadcast = function(title, contents){
	for(var i = this.channel.length - 1; i >= 0;i--){
		if(i !== this.id){
			this.channel[i].send(shisha.msg(title, contents));
		}
	};
}

Tobacco.prototype.onclose = function(callback){
	this.on('close', callback);
}

Tobacco.prototype.onerror = function(callback){
	this.on('error', callback);
}

Tobacco.prototype.raw = function(){
	return this.channel[this.id];
}

module.exports = Tobacco;
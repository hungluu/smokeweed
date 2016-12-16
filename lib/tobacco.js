var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	shisha = require('./shisha');

/**
 * A client
 * @param {Websocket} rawClient
 */
var Tobacco = function(clients, rawClient){
	EventEmitter.call(this);
	this.mailbox = new EventEmitter();

	this.channel = clients;
	this.id = clients.indexOf(rawClient);
	// this.name = '';

	shisha.bind.client(this);
}

util.inherits(Tobacco, EventEmitter);

Tobacco.prototype.receive = function(title, callback){
	this.mailbox.on(title, callback);
}

Tobacco.prototype.send = function(title, contents, sender){
	this.raw().send(shisha.generate.message(title, contents, sender));
}

Tobacco.prototype.broadcast = function(title, contents){
	for(var i = this.channel.length - 1; i >= 0;i--){
		if(i !== this.id){
			this.channel[i].send(shisha.generate.message(title, contents));
		}
	};
}

Tobacco.prototype.raw = function(){
	return this.channel[this.id];
}

module.exports = Tobacco;

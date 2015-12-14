var util = require('util'),
	Tobacco = require('./tobacco'),
	shisha = require('./shisha');

/**
 * A named Client
 * @param {Websocket} rawClient
 */
var Weed = function(clients, rawClient){
	Tobacco.call(this, clients, rawClient);

	shisha.bind.named(this);
}

util.inherits(Weed, Tobacco);

Weed.prototype.send = function(title, contents, to){
	if(to){
		var sender = this.name;
		shisha.find(this.channel, to, function(rawClient){
			rawClient.send(shisha.generate.message(title, contents, sender));
		});
	}
	else
		Tobacco.prototype.send.call(this, title, contents);
}

module.exports = Weed;
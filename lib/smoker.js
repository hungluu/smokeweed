var ws = require('ws').Server,
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	shisha = require('./shisha');

/**
 * Smoker server
 * @param {Object} options
 */
var Smoker = function(options){
	var server = this;
	var defaultOptions = {
		ping : true,
		client : require('./tobacco')
	};

	// init options
	shisha.syncOptions(options, defaultOptions);

	// automatically create server
	if(typeof options.server === 'undefined'){
		options.server = require("http").createServer();
		options.server.listen(5000);
	}

	EventEmitter.call(server);

	server.raw = new ws(options);

	// bind stuffs
	server.raw.on('connection', function(wsClient){
		var client = new options.client(server.raw.clients, wsClient);

		server.emit('before', client);

		server.emit('open', client);

		// heartbeats
		shisha.bindPing(options.ping, client, wsClient);
	});
}

util.inherits(Smoker, EventEmitter);

/**
 * Install a middleware
 * @param  {callable} middleware
 */
Smoker.prototype.use = function(middleware){
	this.on('before', middleware);
}

/**
 * Send message to all clients
 * @param  {string} title
 * @param  {misc} contents
 */
Smoker.prototype.write = function(title, contents){
	for(var i = this.raw.clients.length - 1; i >= 0;i--){
		this.raw.clients[i].send(shisha.msg(title, contents));
	}
}

Smoker.prototype.writeTo = function(name, title, contents){
	shisha.findClientByName(this.raw.clients, name, function(client){
		client.send(shisha.msg(title, contents));
	});
}

module.exports = Smoker;
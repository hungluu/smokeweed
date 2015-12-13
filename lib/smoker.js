var ws = require('ws').Server,
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	shisha = require('./shisha');

/**
 * Smoker server
 * @param {Object} options
 */
var Smoker = function(options){
	EventEmitter.call(this);

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

	this.raw = new ws(options);

	// bind stuffs
	this.raw.on('connection', shisha.makeConnectionCallback(this, options));
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
 * Send message to client(s)
 * @param  {string} title
 * @param  {misc} contents
 * @param  {to} name name of specified user
 */
Smoker.prototype.write = function(title, contents, to){
	if(to){
		shisha.findClientByName(this.raw.clients, to, function(client){
			client.send(shisha.msg(title, contents));
		});
	}
	else for(var i = this.raw.clients.length - 1; i >= 0;i--){
		this.raw.clients[i].send(shisha.msg(title, contents));
	}
}

/**
 * Open event
 * @param  {Function} callback
 */
Smoker.prototype.onopen = function(callback){
	this.on('open', callback);
}

Smoker.prototype.raw = function(){
	return this.raw;
}

module.exports = Smoker;
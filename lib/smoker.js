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

	options = options || {};

	var defaultOptions = {
		heartbeats : true,
		client : require('./weed')
	};

	// init options
	options = shisha.generate.options(options, defaultOptions);

	// bind heartbeats
	shisha.bind.heartbeats(options.heartbeats, this);

	// automatically create server
	if(!options.server)
		options.server = shisha.generate.server(5000);

	this._raw = new ws(options);

	// bind stuffs
	this._raw.on('connection', shisha.generate.callback.open(this, options));
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
Smoker.prototype.send = function(title, contents, to){
	shisha.find(this.raw.clients, to, function(rawClient){
		rawClient.send(shisha.generate.message(title, contents));
	});
}

/**
 * Return raw wsServer object
 * @return {WebsocketServer}
 */
Smoker.prototype.raw = function(){
	return this._raw;
}

module.exports = Smoker;
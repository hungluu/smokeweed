var SmokeWeed = require('./lib/smoker');

var createServer = module.exports = function(options){
	return new SmokeWeed(options);
}

createServer.server = SmokeWeed;

createServer.client = require('./lib/tobacco');

createServer.namedClient = require('./lib/weed');
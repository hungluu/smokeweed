var smokeweed = require('../index');

var server = smokeweed({
	client : smokeweed.namedClient
});

server.use(function(client){
	client.tnet = true
});

server.on('open', function(client){
	console.log(client.name);

	client.on('close', function(){
		console.log('Why you leave me??');
	});
});
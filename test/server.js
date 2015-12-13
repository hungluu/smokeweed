var smokeweed = require('../index');

var server = smokeweed({
	client : smokeweed.namedClient
});

server.use(function(client){
	client.tnet = true
});

server.on('open', function(client){
	client.write('init', 'This is an automated message.');

	client.read('hey', function(msg){
		if(msg === 'hi server'){
			client.write('hi', 'Okey... I hear you');
		}
	});

	client.read('mail', function(msg, to){
		client.write('mail', msg, to);
	});

	client.raw().on('message', function(data){
		console.log('-- ' + data);
	});
});
var smokeweed = require('../index');

var server = smokeweed();

server.use(function(client){
	client.tnet = true
});

server.on('open', function(client){
	client.send('init', 'This is an automated message.');

	client.receive('hey', function(msg){
		if(msg === 'hi server'){
			client.send('hi', 'Okey... I hear you');
		}
	});

	client.receive('mail', function(msg, to){
		client.send('mail', msg, to);
	});

	client.on('close', function(){
		console.log('A client just left');
	});

	client.raw().on('message', function(data){
		console.log('-- ' + data);
	});
});

server.on('idle', function(){
	console.log('! Server is in idle mode now');
});

server.on('wake', function(){
	console.log('! Server just wakes up');
});
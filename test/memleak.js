var memwatch = require('memwatch');

memwatch.on('leak', function(info){
	console.log('Leaked');
	console.log(info);
});
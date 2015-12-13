// LOCAL TESTING
function load(name){
	require('./' + name);
}


load('test/memleak');

load('test/server');

load('test/client');
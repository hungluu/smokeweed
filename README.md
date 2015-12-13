# SmokeWeed
----
An implementation of ws for ez life - ez websocketing. A holy library for you to write websocket application in minutes while having time to smoke weed :)

Just kidding. This is a library for my personal usage. If you wanna use it, you can follow below instruction:

1. Install

```
npm install --save smokeweed
```

2. Start websocket server

```javascript
var smokeweed = require('smokeweed');
var server = smokeweed();
// or everyone has a unique name :)
var server = smokeweed({
    client : smokeweed.namedClient
});
```

3. Bind events

```javascript
server.on('connect', function(client){
    // close, pong, ...
    client.on('close', function(){});
    // send a message to current client
    client.write('title', 'data');
    // listen for a message
    client.read('title', function(data){});
    // write message to another user with his name
    client.write('title', 'data', 'John');
    // broadcasting
    client.broadcast('title', 'data');
});
```
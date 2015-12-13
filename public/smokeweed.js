var smokeweed = (function(host, port){
	var Client = function(host, port){
		this.raw = new WebSocket('ws://' + host + ':' + port);
		this.mailbox = {};

		function createMessageCallback(client){
			return function messageCallback(message){
				message = JSON.parse(message.data);

				if(message.title in client.mailbox){
					for(var i = client.mailbox[message.title].length - 1; i >= 0; i--){
						client.mailbox[message.title][i](message.contents, message.from);
					};
				}
			}
		}

		this.raw.onmessage = createMessageCallback(this);
	}

	Client.prototype = {
		onopen : function(callback){
			this.raw.onopen = callback;
		},
		onerror: function(callback){
			this.raw.onerror = callback;
		},
		onclose: function(callback){
			this.raw.onclose = callback;
		},
		read : function(title, callback){
			if(!(title in this.mailbox)){
				this.mailbox[title] = [];
			}

			this.mailbox[title].push(callback);
		},
		write : function(title, contents, to){
			to = to || '';

			this.raw.send(JSON.stringify({
				title : title,
				contents : contents,
				to : to
			}));
		},
		raw : function(){
			return this.raw;
		}
	}

	return function(host, port){
		return new Client(host, port || 5000);
	}
})();
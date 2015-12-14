var smokeweed = (function(host, port){
	var Client = function(host, port){
		this._raw = new WebSocket('ws://' + host + ':' + port);
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

		this._raw.onmessage = createMessageCallback(this);
	}

	Client.prototype = {
		on : function(event, callback){
			switch(event){
				case 'open' :
					this._raw.onopen = callback;
					break;
				case 'onerror' :
					this._raw.onerror = callback;
					break;
				case 'onclose' :
					this._raw.onclose = callback;
					break;
			}
		},
		receive : function(title, callback){
			if(!(title in this.mailbox)){
				this.mailbox[title] = [];
			}

			this.mailbox[title].push(callback);
		},
		send : function(title, contents, to){
			to = to || '';

			this._raw.send(JSON.stringify({
				title : title,
				contents : contents,
				to : to
			}));
		},
		raw : function(){
			return this._raw;
		}
	}

	return function(host, port){
		return new Client(host, port || 5000);
	}
})();
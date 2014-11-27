/**
 * Created by timothy on 25/11/14.
 */

var customApplicationProviders = {

	logProvider: function () {
		var app = null,
			validTypes = ['log', 'warn', 'error', 'debug', 'info'],
			postUrl;

		var provider = {
			setApp : function(name){
				app = name;
			},
			setUrl: function (url) {
				postUrl = url;
			},
			output: function(type){
				var title = (typeof(app) == 'string') ? app + ':' : '';
				title += (typeof(arguments[1]) == 'string') ? arguments[1] : arguments[1];

				if ((typeof(type) != 'string') || validTypes.indexOf(type) < 0) throw 'logProvider:output: type supplied is invalid';

				return function() {
					var args = [].splice.call(arguments, 0),
						action = (typeof(args[0]) == 'string') ? ':' + args.shift() : '';

					console[type](new Date().getTime(), title + action, [].concat(args));
				};
			},
			$get: function () {
				console.log('when is this called?');
				return {
					log: provider.output,
					warn: provider.output,
					error: provider.output,
					debug: provider.output,
					info: provider.output
				};
			}
		};

		return provider;
	},

	analyticsProvider: function () {
		var appKey;

		return {
			setAppKey: function(key){
				appKey = key;
				//TODO: init the analytics app
			},

			$get: function () {
				return; //TODO: return the analytics object
			}
		};
	}

};




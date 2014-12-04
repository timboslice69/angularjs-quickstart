/**
 * Created by timothy on 03/12/14.
 */
(function(window, angular, undefined) {'use strict';


// define ngSanitize module and register $sanitize service
	angular.module('logging', []).provider('$logging', function () {
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
				var title = (typeof(app) === 'string') ? app + ':' : '';
				title += (typeof(arguments[1]) === 'string') ? arguments[1] : arguments[1];

				if ((typeof(type) !== 'string') || validTypes.indexOf(type) < 0) {
					throw 'logProvider:output: type supplied is invalid';
				}

				return function() {
					var args = [].splice.call(arguments, 0),
						action = (typeof(args[0]) === 'string') ? ':' + args.shift() : '';

					console[type](new Date().getTime(), title + action, [].concat(args));
				};
			},
			$get: function () {
				console.log('when is this called?');
				return console.log;
			}
		};

		provider.error = provider.output('error');
		provider.log = provider.output('log');
		provider.warn = provider.output('warn');
		provider.debug = provider.output('debug');

		return provider;
	});

})(window, window.angular);

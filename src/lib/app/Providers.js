/**
 * Created by timothy on 25/11/14.
 */

var applicationDependencies = applicationDependencies || {providers: {}};

applicationDependencies.providers.loggingProvider = function () {
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
};

applicationDependencies.providers.analyticsProvider = function () {
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
};


applicationDependencies.providers.routeResolver = function () {

	this.$get = function () {
		return this;
	};

	this.routeConfig = function () {
		var viewsDirectory = '/app/views/',
			controllersDirectory = '/app/controllers/',
			servicesDirectory = '/app/services/',

			setBaseDirectories = function (viewsDir, controllersDir, servicesDir) {
				viewsDirectory = viewsDir;
				controllersDirectory = controllersDir;
				servicesDirectory = servicesDir;
			},

			getViewsDirectory = function () {
				return viewsDirectory;
			},

			getControllersDirectory = function () {
				return controllersDirectory;
			},

			getServicesDirectory = function () {
				return servicesDirectory;
			};

		return {
			setBaseDirectories: setBaseDirectories,
			getControllersDirectory: getControllersDirectory,
			getServicesDirectory: getServicesDirectory,
			getViewsDirectory: getViewsDirectory
		};
	}();

	this.route = function (routeConfig) {

		var resolve = function (baseName, path, secure) {
				if (!path) {
					path = '';
				}

				if (typeof(path) == 'object'){
					path  = '';
					//if (!path.controller) path.controller = false;
					//if (!path.service) path.service = false;
					//if (!path.view) path.view = false;
				}


				var routeDef = {};
				routeDef.templateUrl = routeConfig.getViewsDirectory() + path + 'View.' + baseName + '.tmpl.html';
				routeDef.controller = baseName + 'Controller';
				routeDef.secure = (secure) ? secure : false;
				routeDef.resolve = {
					load: ['$q', '$rootScope', function ($q, $rootScope) {
						var dependencies = [
							routeConfig.getControllersDirectory() + path + 'Controller.' + baseName + '.js'
						];

						return resolveDependencies($q, $rootScope, dependencies);
					}]
				};

				return routeDef;
			},

			resolveDependencies = function ($q, $rootScope, dependencies) {
				var defer = $q.defer();
				$script(dependencies, function () {
					defer.resolve();
					$rootScope.$apply();
				});

				return defer.promise;
			};

		return {
			resolve: resolve
		}
	}(this.routeConfig);

};



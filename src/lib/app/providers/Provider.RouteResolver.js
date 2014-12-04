(function(window, angular, undefined) {

	'use strict';

	var $routeResolver = {

		scriptList: [],

		options: {
			dependencyOrder: [
				'filter',
				'service',
				'component',
				'directive',
				'controller'
			],
			view: {
				path: 'application/views/',
				fileTemplate: 'View.*.tmpl.html'
			},

			controller: {
				path: 'application/controllers/',
				fileTemplate: 'Controller.*.js',
				nameTemplate: '*Controller'
			},

			service: {
				path: 'application/services/',
				fileTemplate: 'Service.*.js',
				nameTemplate: '*Service'
			},

			filter: {
				path: 'application/filters/',
				fileTemplate: 'Filter.*.js',
				nameTemplate: '*Filter'
			},

			component: {
				path: 'application/components/',
				fileTemplate: 'Component.*.js',
				nameTemplate: '*Component'
			},

			directive: {
				path: 'application/directives/',
				fileTemplate: 'Directive.*.js',
				nameTemplate: '*Directive'
			}
		},

		setOptions: function(options) {
			for (var option in options) {
				this.options[option] = options[option];
			}
		},

		getPath: function(type) {
			return this.options[type].path;
		},

		getFile: function(type, name) {
			return this.options[type].fileTemplate.replace('*', name);
		},

		getName: function (type, name) {
			return this.options[type].nameTemplate.replace('*', name);
		},


		/**
		 *
		 * @param app
		 */
		prime: function(app) {
			var $RR = this,
				queue = {},
				queueFn = function(type){
					if (typeof(queue[type] === 'undefined')) queue[type] = [];
					return function(){
						queue[type].push(arguments);
					};
				},
				registerFn = function(handler){
					return function (name) {
						$RR.registerScript(name);
						handler.apply(app, arguments);
					}
				};

			app.register = {
				controller: queueFn('controller'),
				component: queueFn('component'),
				directive: queueFn('directive'),
				factory: queueFn('factory'),
				filter: queueFn('filter'),
				service: queueFn('service')
			};

			app.config([
				'$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
				function($controllerProvider, $compileProvider, $filterProvider, $provide) {

					app.register = {
						controller: registerFn($controllerProvider.register),
						component: registerFn($compileProvider.directive),
						directive: registerFn($compileProvider.directive),
						factory: registerFn($provide.factory),
						filter: registerFn($filterProvider.register),
						service: registerFn($provide.service)
					};

					for (var type in queue){
						for (var a = 0, b = queue[type].length; a < b; a++){
							application.register[type].apply(application, queue[type][a]);
						}
					}

					queue = {};
				}
			]);
		},

		/**
		 *
		 * @param name
		 */
		registerScript: function(name){
			this.scriptList.push(name);
		},

		/**
		 *
		 * @param scripts
		 * @param callback
		 */
		loadScripts: function(scripts, callback){
			var $RR = this,
				head = document.getElementsByTagName('head')[0],
				finished = 0,
				finish = function(){
					finished++;
					if (finished == scripts.length) callback.apply();
				};

			for (var element, a = 0, b = scripts.length; a < b; a++){
				// load the script if not already loaded
				if ($RR.scriptList.indexOf(scripts[a].name) < 0) {
					element = document.createElement('script');

					element.onload = element.onerror = function() {
						this.onload = this.onerror = null;
						finish();
					};

					element.type = 'text/javascript';
					element.async = true;
					element.id = scripts[a].name;
					element.src = scripts[a].src;
					$RR.registerScript(scripts[a].name);
					head.insertBefore(element, head.lastChild);

				}
				// otherwise call the callback function
				else callback.apply(this, [scripts[a]]);
			}
		},

		resolve: function (name, modules, secure) {
			var $RR = this;

			// make sure all modules are in arrays for processing later
			for (var type in modules){
				if (typeof(modules[type]) === 'string') modules[type] = [modules[type]];
			}

			// check for view and controller... otherwise fail!
			if (!modules.controller || (modules.controller.length <= 0)) {
				throw "routeResolver: No controller supplied"
			}
			if (!modules.view || (modules.view.length <= 0)) {
				throw "routeResolver: No view supplied"
			}

			return {
				templateUrl: $RR.getPath('view') + $RR.getFile('view', modules.view[0]),
				controller: $RR.getName('controller', modules.controller[0]),
				secure: (secure) ? secure : false,
				resolve: {
					load: ['$q', '$rootScope', function ($q, $rootScope) {
						var dependencies = [];

						for (var type, a = 0, b = $RR.options.dependencyOrder.length; a < b; a++){
							type = $RR.options.dependencyOrder[a];

							if (typeof(modules[type]) !== 'undefined') {

								for (var c = 0, d = modules[type].length; c < d; c++){

									dependencies.push({
										name: $RR.getName(type, modules[type][c]),
										src: $RR.getPath(type) + $RR.getFile(type, modules[type][c])
									});

								}
							}
						}

						return $RR.resolveDependencies($q, $rootScope, dependencies);
					}]
				}
			};

		},

		resolveDependencies: function ($q, $rootScope, dependencies) {
			var defer = $q.defer();

			//console.log(dependencies);

			$routeResolver.loadScripts(dependencies, function (error) {
				defer.resolve();
				//$rootScope.$apply()
			});

			return defer.promise;
		},

		$get: function () {
			return this;
		}


	};

	window.$$routeResolver = $routeResolver;

	angular.module('routeResolver', []).provider('$routeResolver', $routeResolver);

})(window, window.angular);

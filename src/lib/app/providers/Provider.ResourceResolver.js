(function(window, angular) {

	'use strict';

	var $resourceResolver = {

		resourceList: [],

		options: {
			dependencyOrder: [
				'filter',
				'service',
				'component',
				'directive',
				'controller'
			],

			resolveExclude: [
				'filter',
				'service',
				'component',
				'directive',
				'controller',
				'view'
			],

			formatNameOnRegister: [
				'component',
				'directive',
				'filter'
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

		prime: function(app) {
			var resourceResolver = this,
				queue = {},
				queueFn = function(type){
					if (typeof(queue[type] === 'undefined')) queue[type] = [];
					return function(){
						queue[type].push(arguments);
					};
				},
				registerFn = function(type, handler){
					return function (name) {
						var registerName = name;

						if (resourceResolver.options.formatNameOnRegister.indexOf(type) >= 0){
							registerName = resourceResolver.getName(type, name);
						}

						resourceResolver.registerResource(registerName);
						handler.apply(app, arguments);
					}
				};

			//resourceResolver.injector = angular.injector(['resourceResolver', 'ng']);

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
						controller: registerFn('controller', $controllerProvider.register),
						component: registerFn('component', $compileProvider.directive),
						directive: registerFn('directive', $compileProvider.directive),
						factory: registerFn('factory', $provide.factory),
						filter: registerFn('filter', $filterProvider.register),
						service: registerFn('service', $provide.service)
					};

					for (var type in queue){
						for (var a = 0, b = queue[type].length; a < b; a++){
							app.register[type].apply(app, queue[type][a]);
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
		registerResource: function(name){
			// Capitalise everything incase there is problems requesting resources in different string cases
			this.resourceList.push(name.toUpperCase());
			return this;
		},

		resourceExists: function(name){
			// Capitalise everything incase there is problems requesting resources in different string cases
			return this.resourceList.indexOf(name.toUpperCase()) >= 0;
		},

		/**
		 *
		 * @param scripts
		 * @param callback
		 */
		loadScripts: function(scripts, callback){
			var resourceResolver = this,
				head = document.getElementsByTagName('head')[0],
				finished = 0,
				finish = function(){
					finished++;
					if (finished == scripts.length) callback.apply();
				};

			if (scripts.length > 0) {
				for (var element, a = 0, b = scripts.length; a < b; a++){

					/**
					 * this is a check to see if the script has already been requested
					 * trying to catch the problem with loading a resource in quick succession
					 * and both of them being loaded because the script hasn't registered before
					 * the second instance is called
					 */
					if (document.getElementById('resource-' + scripts[a].name) !== null) {
						finish();
						continue;
					}

					element = document.createElement('script');
					element.onload = function() {
						this.onload = this.onerror = null;
						finish();
					};
					element.onerror = function() {
						this.onload = this.onerror = null;
						finish();
					};

					element.type = 'text/javascript';
					element.async = true;
					element.id = 'resource-' + scripts[a].name;
					element.src = scripts[a].src;
					head.insertBefore(element, head.lastChild);
				}
			}
			else callback.apply(this, []);

		},

		require: function (modules, secure) {
			var resourceResolver = this;

			if (typeof(secure) !== 'boolean') {
				secure = true;
			}

			// make sure all modules are in arrays for processing later
			for (var type in modules){
				if (typeof(modules[type]) === 'string') modules[type] = [modules[type]];
			}

			return resourceResolver.buildDependencies(modules, secure);
		},

		buildDependencies: function(modules, secure){
			var resourceResolver = this,
				dependencies = [];

			for (var type, a = 0, b = resourceResolver.options.dependencyOrder.length; a < b; a++){
				type = resourceResolver.options.dependencyOrder[a];


				if (typeof(modules[type]) !== 'undefined') {

					for (var name, c = 0, d = modules[type].length; c < d; c++){
						name = resourceResolver.getName(type, modules[type][c]);

						// check if the dependency already is registered, if it is, don't load it.
						/**
						 * there is a small issue here if a resource is still being fetched and is requested again.
						 * e.g. using the require function and also putting the same resource in the primary route
						 * the the resource is loaded twice as the resource is only registered once the script is ready
						 * the script loader now checks for the script with the same id before injecting a new script, this solves the problem
 						 */
						if (resourceResolver.resourceExists(name)) continue;

						dependencies.push({
							name: name,
							src: resourceResolver.getPath(type) + resourceResolver.getFile(type, modules[type][c])
						});

					}
				}
			}

			return resourceResolver.resolveDependencies(dependencies);
		},

		resolve: function (properties, secure) {
			var resourceResolver = this,
				dependencies = {};

			// make sure all modules are in arrays for processing later
			for (var prop in properties){
				if ((resourceResolver.options.resolveExclude.indexOf(prop) >= 0)){
					dependencies[prop] = ((typeof(properties[prop]) === 'string') ) ? [properties[prop]] : properties[prop]
				}
			}

			// check for view and controller... otherwise fail!
			if (!properties.controller || (properties.controller.length <= 0)) {
				throw "resourceResolver: No controller supplied"
			}
			if (!properties.view || (properties.view.length <= 0)) {
				throw "resourceResolver: No view supplied"
			}

			// build up the resolve object
			var resolve = {
				load: function () {
					return resourceResolver.buildDependencies(dependencies, secure);
				}
			};
			// append additional resolve properties supplied, excluding the properties used in the resourceResolver.
			for (prop in properties){
				if (resourceResolver.options.resolveExclude.indexOf(prop) < 0){
					resolve[prop] = properties[prop];
				}
			}

			return {
				templateUrl: resourceResolver.getPath('view') + resourceResolver.getFile('view', properties.view[0]),
				controller: resourceResolver.getName('controller', properties.controller[0]),
				secure: (secure) ? secure : false,
				resolve: resolve
			};

		},

		resolveDependencies: function (dependencies) {
			return new Promise(function(resolve, reject) {
				$resourceResolver.loadScripts(dependencies, function (error) {
					if (error) reject();
					else resolve();
				});
			});
		},

		$get: function () {
			return this;
		}


	};

	//window.$$resourceResolver = $resourceResolver;
	window.resourceResolver = angular.module(
			'resourceResolver',
			['ng']
		)
		.provider(
			'$resourceResolver',
			$resourceResolver
		);

	$resourceResolver.prime(window.resourceResolver);
	window.$resourceResolver = $resourceResolver;


})(window, window.angular);

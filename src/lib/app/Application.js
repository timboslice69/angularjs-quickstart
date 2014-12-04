/**
 * Created by timothy on 24/11/14.
 */

var application = angular
	.module(
		'Application',
		[
			'ngRoute',
			'ngResource',
			'ngSanitize',
			'routeResolver',
			'logging'
		]
	)
	.constant(
		'APP_CONFIG',
		{
			API_URI: 'https://domain/api/'
		}
	)
	.constant(
		'APP_EVENTS', {
			needsPlayer: 'Player:profile:missing',
			authenticated: 'Auth:authentication:success',
			noLoginToken: 'Auth:token:missing',
			loginSuccess: 'Auth:login:success',
			loginError: 'Auth:login:error',
			logoutSuccess: 'Auth:logout:success',
			playerUpdated: 'Player:updated'
		}
	)
	.config([
		'APP_CONFIG', '$routeProvider', '$routeResolverProvider', '$locationProvider', '$compileProvider', '$loggingProvider',
		function(APP_CONFIG, $routeProvider, $routeResolverProvider, $locationProvider, $compileProvider, $loggingProvider) {

			$loggingProvider.setApp('AngularQuickStart');
			/*
			 var log = $loggingProvider.output('log', 'Config'),
			 error = $loggingProvider.output('error', 'Config'),
			 debug = $loggingProvider.output('debug', 'Config');
			 */

			$routeResolverProvider.setOptions({
				view: {
					path: 'templates/views/',
					fileTemplate: 'View.*.tmpl.html'
				},
				service: {
					path: 'lib/app/services/',
					fileTemplate: 'Service.*.js',
					nameTemplate: '*Service'
				},
				controller: {
					path: 'lib/app/controllers/',
					fileTemplate: 'Controller.*.js',
					nameTemplate: '*Controller'
				},
				filter: {
					path: 'lib/app/filters/',
					fileTemplate: 'Filter.*.js',
					nameTemplate: '*Filter'
				},
				directive: {
					path: 'lib/app/directives/',
					fileTemplate: 'Directive.*.js',
					nameTemplate: '*Directive'
				},
				component: {
					path: 'lib/app/components/',
					fileTemplate: 'Component.*.js',
					nameTemplate: '*Component'
				}
			});


			/** Set hashbang Mode */
			$locationProvider.hashPrefix('!');

			/** Allow href and image resource protocols */
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob|sms):/);
			$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);


			/** Define Routes */
			$routeProvider
				.when('/home', $routeResolverProvider.resolve('Home', {view: 'Home', controller: ['Home']}))
				.when('/login', $routeResolverProvider.resolve('Login', {view: 'Login', controller: 'Login',  service: ['Authentication'], component: ['Icon'], directive: ['Background']}))
				.when('/elsewhere', $routeResolverProvider.resolve('Elsewhere', {view: 'Login', controller: 'Home',  service: ['Authentication']}))
				.otherwise({ redirectTo: '/home' });

			console.log('configured');
		}
	])
	.run([
		'$rootScope', '$location', '$window', '$route', '$logging',
		function($rootScope, $location, $window, $route, $logging) {

/*			var log = $logging.output('log', 'Run'),
				error = $logging.output('error', 'Run'),
				debug = $logging.output('debug', 'Run');*/

			// register listener to watch route changes
			$rootScope.$on('$routeChangeStart', function(event, $nextRoute, $currentRoute) {
				//console.log(['$routeChangeStart', $nextRoute]);

				/**
				 * ROUTE NAME
				 * Check if the next route has a name parameter and assign it to the rootScope,
				 * this give us the option of changing styles or other ui elements based on the route name
				 */
				//$rootScope.name = angular.isDefined($nextRoute.$$route.name) ? $nextRoute.$$route.name : '';

			});

			$rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
				/**
				 * Google Analytics Tracking
				 * Universal analytics will fetch url and title so we trigger it after the route change has completed
				 * The current path is still send for shits and giggles
				 */

				// Log.pathChange($location.path());

			});
		}
	]);


/**
 * The Magic: routeResolver primes application to accept
 * module registration immediately, storing them in a temporary queue,
 * once the angular app is setup the registered modules will be loaded
 */

$$routeResolver.prime(application);


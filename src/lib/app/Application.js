/**
 * Created by timothy on 24/11/14.
 */

var applicationDependencies = applicationDependencies || {providers: {}};


var application = angular
	.module(
		'Application',
		[
			'ngRoute',
			'ngResource',
			'ngSanitize',
			//'routeResolverServices',
			'Services',
			'Controllers',
			'Filters',
			'Components',
			'Directives'
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
	.provider('$logging', applicationDependencies.providers.loggingProvider)
	.provider('$analytics', applicationDependencies.providers.analyticsProvider)
	.provider('$routeResolver', applicationDependencies.providers.routeResolver)
	.config([
		'APP_CONFIG', '$routeProvider', '$routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$locationProvider','$loggingProvider',
		function(APP_CONFIG, $routeProvider, $routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider, $loggingProvider) {

			$loggingProvider.setApp('AngularQuickStart');

			$routeResolverProvider.routeConfig.setBaseDirectories('templates/views/', 'lib/app/controllers/');

/*			var log = $loggingProvider.output('log', 'Config'),
				error = $loggingProvider.output('error', 'Config'),
				debug = $loggingProvider.output('debug', 'Config');*/


			application.register =
			{
				controller: $controllerProvider.register,
				directive: $compileProvider.directive,
				filter: $filterProvider.register,
				factory: $provide.factory,
				service: $provide.service
			};

			/** Set hashbang Mode */
			$locationProvider.hashPrefix('!');

			/** Allow href and image resource protocols */
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob|sms):/);
			$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);


			var route = $routeResolverProvider.route;

			/** Define Routes */
			$routeProvider
				.when('/home', route.resolve('Home'))
				.when('/login', route.resolve('Login', {view: 'Login', controller: 'Login',  service: 'Login'}))
				.otherwise({ redirectTo: '/home' });
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

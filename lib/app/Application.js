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
	.provider('log', customApplicationProviders.logProvider)
	.provider('analytics', customApplicationProviders.analyticsProvider)
	.config([
		'APP_CONFIG', '$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider', 'logProvider',
		function(APP_CONFIG, $routeProvider, $locationProvider, $httpProvider, $compileProvider, logProvider) {

			logProvider.setApp('AngularQuickStart');

			var log = logProvider.output('log', 'Config'),
				error = logProvider.output('error', 'Config'),
				debug = logProvider.output('debug', 'Config');


			/** Set hashbang Mode */
			$locationProvider.hashPrefix('!');

			/** Allow href and image resource protocols */
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob|sms):/);
			$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);


			/** Define Routes */
			$routeProvider
				.when('/', {
					templateUrl: 'views/home.html',
					controller: 'HomeCtrl',
					viewName: 'home'
				})
				.otherwise({
					redirectTo: '/home'
				});
		}
	]);


application

	.run([
		'$rootScope', '$location', '$window', '$route', 'log',
		function($rootScope, $location, $window, $route, log) {

			var log = log.output('log', 'Run'),
				error = log.output('error', 'Run'),
				debug = log.output('debug', 'Run');

			// register listener to watch route changes
			$rootScope.$on("$routeChangeStart", function(event, $nextRoute, $currentRoute) {
				console.log(['$routeChangeStart', $nextRoute]);

				/**
				 * ROUTE NAME
				 * Check if the next route has a name parameter and assign it to the rootScope,
				 * this give us the option of changing styles or other ui elements based on the route name
				 */
				$rootScope.name = angular.isDefined($nextRoute.$$route.name) ? $nextRoute.$$route.name : '';

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

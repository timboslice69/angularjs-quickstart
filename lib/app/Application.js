/**
 * Created by timothy on 24/11/14.
 */

angular
	.module(
		'Application',
		[
			'ngRoute', // Angular.js route handler
			'ngAnimate', // Angular.js animation
			'ngResource', // Angular.js resource handler
			'ngSanitize', // Angular.js resource handler
			'ServicesCore', // Application services
			'Services', // Application services
			'Controllers', // Controllers for the routes/views,
			'ControllersClass', // Controllers for the class functionality
			'ControllersManagement', // Controllers for the management functionality
			'Filters',
			'Directives',
			'Components'
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
		'APP_CONFIG', '$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider',
		function(APP_CONFIG, $routeProvider, $locationProvider, $httpProvider, $compileProvider) {

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
					viewName: 'manage'
				})
				.otherwise({
					redirectTo: '/home'
				});
		}
	])
	.run([
		'$rootScope', '$location', '$window', '$route',
		function($rootScope, $location, $window, $route) {

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

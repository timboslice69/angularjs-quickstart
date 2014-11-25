/**
 * Created by timothy on 24/11/14.
 */

angular.module('Controllers', [])

	.controller('HomeCtrl', [
		'$scope', '$rootScope', '$route', 'log', 'APP_CONFIG',
		function($scope, $rootScope, log, APP_CONFIG) {
			$scope._name = 'HomeCtrl';

			console.log('log');


			$scope.init = function() {
				//log('init');
				$rootScope.ready = true;
				$rootScope.loading = false;
			};

			$scope.login = AuthSvc.login;

			$scope.init();
		}
	]);
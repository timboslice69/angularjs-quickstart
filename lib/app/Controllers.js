/**
 * Created by timothy on 24/11/14.
 */


angular.module('Controllers', [])

	.controller(
	'LoginCtrl', [
		'$scope', '$rootScope', '$route', 'APP_CONFIG', 'AuthSvc',
		function($scope, $rootScope, $route, APP_CONFIG, AuthSvc) {
			$scope._name = 'LoginCtrl';
			var log = $h.namedLog($scope._name, $scope);


			$scope.init = function() {
				//log('init');
				$rootScope.ready = true;
				$rootScope.loading = false;
			};

			$scope.login = AuthSvc.login;

			$scope.init();
		}
	]);
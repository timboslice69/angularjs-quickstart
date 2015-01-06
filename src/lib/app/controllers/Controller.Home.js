/**
 * Created by timothy on 27/11/14.
 */

resourceResolver.register.controller('HomeController', [
	'$rootScope', '$scope', '$route', '$logging', 'APP_CONFIG', 'RestExampleService',
	function($rootScope, $scope, $logging, APP_CONFIG, RestExampleService) {
		$scope._name = 'HomeController';

		$scope.init = function() {
			$scope.items = RestExampleService.items;
		};

 		$scope.init();
	}
]);
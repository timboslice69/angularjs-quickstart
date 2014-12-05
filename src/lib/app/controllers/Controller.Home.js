/**
 * Created by timothy on 27/11/14.
 */

application.register.controller('HomeController', [
	'$rootScope', '$scope', '$route', '$logging', 'APP_CONFIG',
	function($rootScope, $scope, $logging, APP_CONFIG) {

		$scope._name = 'HomeController';

		//var log = $log.output('log', $scope._name);
		$scope.quantity = 0;

		$scope.init = function() {
			$scope.quantity = 0;
		};

		$scope.increaseQuantity = function(){
			$scope.quantity++;
		};

		$scope.init();
	}
]);
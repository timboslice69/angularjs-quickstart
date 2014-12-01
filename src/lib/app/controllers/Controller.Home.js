/**
 * Created by timothy on 27/11/14.
 */

application.register.controller('HomeController', [
	'$rootScope', '$scope', '$route', '$logging', 'APP_CONFIG',
	function($rootScope, $scope, $logging, APP_CONFIG) {
		$scope._name = 'HomeCtrl';

		//var log = $log.output('log', $scope._name);
		$scope.something = 0;

		$scope.init = function() {
			$scope.something = 0;
		};

		$scope.increaseQuantity = function(){
			$scope.something++;
		};

		$scope.init();
	}
]);
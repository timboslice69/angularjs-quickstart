/**
 * Created by timothy on 24/11/14.
 */

angular.module('Controllers', [])

	.controller('MasterCtrl', [
		'$scope', '$rootScope', '$route', '$logging', 'APP_CONFIG',
		function($scope, $rootScope, $logging, APP_CONFIG) {
			$scope._name = 'MasterCtrl';

		}
	])

	/*.controller('HomeCtrl', [
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
	])*/

;
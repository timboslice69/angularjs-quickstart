console.log('login controller');
application.register.controller('LoginController', [
	'$rootScope', '$scope', '$logging', 'APP_CONFIG',
	function($rootScope, $scope, $logging, APP_CONFIG) {
		$scope._name = 'LoginController';

		$scope.say = 'it fn worked!';

		$scope.login = function(){

		}
	}
]);


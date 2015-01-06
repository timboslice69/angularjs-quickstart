/**
 * Created by timothy on 03/12/14.
 */

resourceResolver.register.controller('MasterController', [
	// Inject Providers
	'$rootScope', '$scope', '$logging', 'APP_CONFIG',
	// Inject Services
	function($scope, $rootScope, $logging, APP_CONFIG) {
		$scope._name = 'MasterController';

	}
]);

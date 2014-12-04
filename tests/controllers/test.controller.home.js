describe('HomeController', function() {
	var $rootScope, $scope, $controller;

	beforeEach(module('Application'));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$controller = _$controller_;

		$controller('HomeController', {'$rootScope' : $rootScope, '$scope': $scope});
	}));

	it('has correct initial values', function() {
		expect($scope.quantity).toBe(0);
	});

	it('increments correctly', function() {
		$scope.increaseQuantity();
		expect($scope.quantity).toBe(1);
		$scope.increaseQuantity();
		expect($scope.quantity).toBe(2);
		$scope.increaseQuantity();
		expect($scope.quantity).toBe(3);
		$scope.increaseQuantity();
		expect($scope.quantity).toBe(4);
	});
});
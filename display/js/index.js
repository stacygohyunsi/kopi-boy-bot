var app = angular.module('display', ["firebase", "ngAnimate", "ngMaterial"]);

app.controller("main", function($scope, $http, $firebaseObject, $firebaseArray) {
	$scope.customerProfile = {};
  var refOrders = firebase.database().ref("/orders");
  $scope.orders = $firebaseArray(refOrders);

	var refCustomers = firebase.database().ref("/customers");
  $scope.customers = $firebaseArray(refCustomers);	

	$scope.getCustomerName = function(id) {
		$scope.customerProfile[id] = {};
		$scope.customers.$loaded().then(function(x) {
			$scope.customerProfile[id] = $scope.customers.$getRecord(id);
		});
	}
	
	$scope.orders.$loaded()
  .then(function() {
    console.log($scope.orders);
		$scope.orders = $scope.orders.map(function(order) {
			moment(order.pickup_at).format('LLLL');
			return order;
		})	
  })
  .catch(function(err) {
    console.error(err);
  });
})

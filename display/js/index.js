var app = angular.module('display', ["firebase"]);

app.controller("main", function($scope, $http, $firebaseObject, $firebaseArray) {
	
  var refOrders = firebase.database().ref("/orders");
  $scope.orders = $firebaseArray(refOrders);	

	var refCustomers = firebase.database().ref("/customers");
  $scope.customers = $firebaseArray(refCustomers);	

	$scope.getCustomerName = function(id) {
		return $scope.customers.$getRecord(id);
	}
	
	$scope.orders.$loaded()
  .then(function() {
    console.log($scope.orders);
  })
  .catch(function(err) {
    console.error(err);
  });
})

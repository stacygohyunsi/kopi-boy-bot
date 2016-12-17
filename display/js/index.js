var app = angular.module('display', ["firebase", "ngAnimate", "ngMaterial"]);

app.controller("main", function($scope, $http, $firebaseObject, $firebaseArray,$mdDialog) {
	$scope.customerProfile = {};
  var refOrders = firebase.database().ref("/orders");
  $scope.orders = $firebaseArray(refOrders);

	var refCustomers = firebase.database().ref("/customers");
  $scope.customers = $firebaseArray(refCustomers);	

	$scope.change = function(order, status, ev) {
		if (!order.confirmed && !order.rejected) {
			var confirm = $mdDialog.confirm()
				.title('Order status')
				.textContent('Are you sure you want to '+ status +' order?')
				.targetEvent(ev)
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirm).then(function() {
				order[(status == "confirm") ? 'confirmed' : 'rejected'] = true;
				$scope.orders.$save(order).then(function(ref) { });
			}, function() {
				console.log("cancelled");
			});
		}
	}

	$scope.getCustomerName = function(id) {
		$scope.customerProfile[id] = {};
		$scope.customers.$loaded().then(function(x) {
			$scope.customerProfile[id] = $scope.customers.$getRecord(id);
		});
	}
	$scope.refinePickupTime = function(pickupTime) {
		var date = new Date();
		var pickupTimeComponents = pickupTime.split(":");
		date.setHours(pickupTimeComponents[0]);
		date.setMinutes(pickupTimeComponents[1]);
		return moment(date).format('h:mm a');
	}

	$scope.orders.$loaded()
  .then(function() {
    console.log($scope.orders);
  })
  .catch(function(err) {
    console.error(err);
  });
})

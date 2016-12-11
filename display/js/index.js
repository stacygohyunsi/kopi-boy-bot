var app = angular.module('display', ["firebase"]);

app.controller("main", function($scope, $http, $firebaseObject, $firebaseArray) {
	
  var ref = firebase.database().ref("/orders");
	ref.on("value", function(snapshot) {
		console.log(snapshot.keys());
	});

  // download the data into a local object
  $scope.orders = $firebaseArray(ref);	
	$scope.orders.$loaded()
  .then(function() {
    console.log($scope.orders);
		var privateTodosRef = $scope.orders.orderByChild("customer").equalTo(customer);
		console.log(privateTodosRef);
  })
  .catch(function(err) {
    console.error(err);
  });
	// $http.get("/api/orders").then(function(resp) {
	// 	console.log(resp);
	// 	$scope.orders = resp.data;
	// }, function(err){
	// 	console.log(err);
	// })
})

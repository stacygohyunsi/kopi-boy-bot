var app = angular.module('display', []);

app.controller("main", function($scope, $http) {
	
	$scope.collected = function() {
		
	}
	
	$http.get("/api/orders").then(function(resp) {
		console.log(resp);
		$scope.orders = resp.data;
	}, function(err){
		console.log(err);
	})
})

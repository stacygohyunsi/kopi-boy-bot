var app = angular.module('display', []);

app.controller("main", function($scope, $http) {
	$http.get("/api/orders").then(function(resp) {
		console.log(resp);
	})
})

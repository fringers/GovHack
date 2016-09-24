
app.controller('loginController', function($rootScope, $scope, $mdDialog) {
	$rootScope.title = "Login";
	
	$scope.login = function() {
		if(!$scope.loginForm.$valid)
			return;
		
		firebase.auth().signInWithEmailAndPassword($scope.userInput.email, $scope.userInput.password).catch(function(error) {
		  $mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('body')))
				.clickOutsideToClose(true)
				.title('Error')
				.textContent(error.message)
				.ariaLabel('Error')
				.ok('Ok')
			);
		});
	}
});


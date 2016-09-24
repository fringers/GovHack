
app.controller('registerController', function($rootScope, $scope, $mdDialog) {
	$rootScope.title = "Register";
	
	$scope.createAccount = function() {
		if(!$scope.registerForm.$valid)
			return;
		
		firebase.auth().createUserWithEmailAndPassword($scope.userInput.email, $scope.userInput.password).catch(function(error) {
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


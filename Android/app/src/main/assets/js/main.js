var app = angular.module('HackApp', ['ngMaterial', 'ngMessages' ]);

app.controller('indexController', function($rootScope, $scope, $mdSidenav, dbService) {

    initFirebase();
	init();

	
	function init() {
		$scope.openMenu = function($mdOpenMenu, ev) {
		  $mdOpenMenu(ev);
		};
		$scope.logout = function() {
		  firebase.auth().signOut();
		};
		
		$rootScope.navigationHistory = [];
		
		$rootScope.navigate = function(url, canGoBack) {
			if(canGoBack == undefined)
				canGoBack = true;

			if(canGoBack) {
				$rootScope.navigationHistory.push($rootScope.currentTemplate);
			}
			else {
				$rootScope.navigationHistory = [];
			}
			
			$rootScope.currentTemplate = url + ".tpl";
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		};
		
		$rootScope.navigateBack = function() {
			if($rootScope.navigationHistory.length === 0) {
				console.error("Navigate back error - history is empty");
				return;
			}
			
			$rootScope.currentTemplate = $rootScope.navigationHistory.pop();

			if(!$scope.$$phase) {
				$scope.$apply();
			}
		};

		onBackPressed = function() {
			$rootScope.navigateBack();
		};

		$rootScope.canNavigateBack = function() {
			return $rootScope.navigationHistory.length > 0;
		};
		
		$rootScope.navigate('login', false);
	}
	
	function initFirebase() {
		firebase.auth().onAuthStateChanged(function(user) {
		    $rootScope.user = user;
		  
		    if (user) {
                dbService.loadUserCases();
		        $rootScope.navigate("main", false);
		    } else {
			    $rootScope.navigate("login", false);
		    }
		});
	}
});

var onBackPressed;

function backButton() {
	if(onBackPressed)
		onBackPressed();
}



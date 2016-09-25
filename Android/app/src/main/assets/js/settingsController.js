
app.controller('settingsController', function($rootScope, $scope, dbService) {
	$rootScope.title = "Ustawienia";

    $scope.settings = {};

    dbService.getUserSettings(function(settings) {
        $scope.settings = settings;
    });

	$scope.save = save;
	function save() {
        dbService.saveUserSetting($scope.settings);
	}
});


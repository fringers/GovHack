
app.controller('caseController', function($rootScope, $scope, $mdDialog, dbService) {

    $scope.case = $rootScope.detailsItem;
    $rootScope.detailsItem = null;

    $rootScope.title = $scope.case.name;

    dbService.getDetailsForCase($scope.case, function() {
         if (!$scope.$$phase)
             $scope.$apply();
    });
    $scope.userCase = dbService.getUserCaseInfo($scope.case);

    $scope.editNr = false;
    $scope.editCaseNumber = function() { $scope.editNr = true; };

    $scope.saveUserCase = function() {
        $scope.editNr = false;
        saveUserCase();
    };

    function saveUserCase() {
        dbService.updateUserCase($scope.userCase);
    }
});


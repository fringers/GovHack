
app.controller('caseController', function($rootScope, $scope, $mdDialog, dbService) {

    $scope.case = $rootScope.detailsItem;
    $rootScope.detailsItem = null;

    $rootScope.title = $scope.case.name;

    dbService.getDetailsForCase($scope.case, function() {
         if (!$scope.$$phase)
             $scope.$apply();
    });
    $scope.userCase = dbService.getUserCaseInfo($scope.case);
    if($scope.userCase.deadlineString)
        $scope.userCase.deadline = new Date($scope.userCase.deadlineString);

    $scope.editNr = false;
    $scope.editCaseNumber = function() { $scope.editNr = true; };

    $scope.showDeadline = false;
    $scope.showCaseNumber = false;
    $scope.showResponseTime = false;
    $scope.showDocs = false;
    $scope.showSteps = false;
    $scope.showComments = false;
    $scope.showPayments = false;

    $scope.saveUserCase = function() {
        $scope.editNr = false;
        if($scope.userCase.deadline)
            $scope.userCase.deadlineString = "" + $scope.userCase.deadline;
        saveUserCase();
    };

    function saveUserCase() {
        dbService.updateUserCase($scope.userCase);
    }
});


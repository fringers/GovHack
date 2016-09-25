
app.controller('mainController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Twoje sprawy";

    $scope.cases = loadUserCases();
    $scope.remove = remove;
    $scope.viewDetails = viewDetails;

    dbService.onUserCasesUpdated(function() {
        $scope.cases = loadUserCases();
        if (!$scope.$$phase)
            $scope.$apply();
    });

    function remove(index) {
        dbService.removeUserCase($scope.cases[index].userCase);
        $scope.cases.splice(index, 1);
    }

    function viewDetails(item, index) {
        $rootScope.detailsItem = item;

        $rootScope.navigate("caseDetails");
    }

    function loadUserCases() {
        var userCases = dbService.getUserCases();
        if(userCases == null)
            return [];

        var result = [];
        for(var id in userCases) {
            var c = dbService.getCaseById(userCases[id].case);
            if(c == null)
                continue;

            dbService.getDetailsForCase(c, function() {

                setTimeout(function() {
                    if (!$scope.$$phase)
                        $scope.$apply();
                }, 500);
            });

            c.userCase = userCases[id];
            if(c.userCase.deadlineString)
            {
                c.deadlineStringToShow = new Date(c.userCase.deadlineString).toISOString().slice(0, 10);
            }

            result.push(c);
        }
        return result;
    }
});


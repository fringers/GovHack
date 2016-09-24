
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
                if (!$scope.$$phase)
                    $scope.$apply();
            });

            c.userCase = userCases[id];

            result.push(c);
        }
        return result;
    }
});

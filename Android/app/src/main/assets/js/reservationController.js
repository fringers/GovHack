
app.controller('reservationController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Rezerwacja";

    $scope.cases = loadUserCases();
    dbService.onUserCasesUpdated(function() {
        $scope.cases = loadUserCases();
        if (!$scope.$$phase)
            $scope.$apply();
    });


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


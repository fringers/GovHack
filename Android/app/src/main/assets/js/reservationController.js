
app.controller('reservationController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Rezerwacja";

    $scope.cases = loadUserCases();
    dbService.onUserCasesUpdated(function() {
        $scope.cases = loadUserCases();
        if (!$scope.$$phase)
            $scope.$apply();
    });

    $scope.reservation = reservation;

    function reservation() {
        var toRegister = [];

        for(var id in $scope.cases) {
            var c = $scope.cases[id];

            if(!c.details || !c.details.departments || c.details.departments.length == 0 || !c.details.departments['0'].endPoint
                || !c.details.departments['0'].apiGroups || c.details.departments['0'].apiGroups.length == 0)
                continue;

            toRegister.push(new caseO(c.id, c.details.departments['0'].endPoint, c.details.departments['0'].apiGroups['0']));
        }

        var y = $scope.date.getFullYear();
        var m = $scope.date.getMonth() + 1;
        var d = $scope.date.getDate();
        var day = new Date(y, m, d).getTime();
        var timeFrom = $scope.time.getHours() * 60 * 60 + $scope.time.getMinutes() * 60; // ilosc sekund po polnocy

        findBestReservations(day, timeFrom, toRegister, function(result) {

        });
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


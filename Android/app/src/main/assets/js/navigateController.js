
app.controller('navigateController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Nawigacja";

    $scope.viewDetails = viewDetails;
    $scope.openMap = openMap;
    $scope.makeReservation = makeReservation;

    $scope.cases = loadUserCases();
    dbService.onUserCasesUpdated(function() {
        $scope.cases = loadUserCases();
        if (!$scope.$$phase)
            $scope.$apply();
    });

    function viewDetails(item) {
        $rootScope.detailsItem = item;

        $rootScope.navigate("caseDetails");
    }

    function openMap(dep) {
        $rootScope.selectedDep = dep;

        $rootScope.navigate("map");
    }

    function makeReservation() {
        $rootScope.navigate("reservation");
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

            c.showDeps = false;
            dbService.getDetailsForCase(c, function() {
                calculateQueues();
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

    function calculateQueues() {
        var array = [];
        for(var id in $scope.cases) {
            var c = $scope.cases[id];

            for(var depId in c.details.departments) {
                var dep = c.details.departments[depId];
                array.push(getQueue(dep));
            }
        }
        Promise.all(array).then(data => {
            if (!$scope.$$phase) $scope.$apply();
        });
    }

    function getQueue(dep) {
        return Promise.resolve($.get('https://api.um.warszawa.pl/api/action/wsstore_get/?id=' + dep.queueId))
        .then(data => {
            parseQueue(dep, data);
        });
    }

    function parseQueue(dep, data) {
        for(var nId in dep.names) {
            var name = dep.names[nId];

            for(var id in data.result.grupy) {
                var group = data.result.grupy[id];

                if(group.nazwaGrupy == name) {
                    dep.queueData = group;
                    return;
                }
            }
        }
    }
});


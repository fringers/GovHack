
app.controller('navigateController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Nawigacja";

    $scope.viewDetails = viewDetails;

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

                calculateQueues();

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

    function calculateQueues() {
        for(var id in $scope.cases) {
            var c = $scope.cases[id];
            for(var depId in c.details.departments) {
                var dep = c.details.departments[depId];

                getQueue(dep);
            }
        }
    }

    function getQueue(dep) {
        
        $.get('https://api.um.warszawa.pl/api/action/wsstore_get/?id=' + dep.queueId)
            .done(function(data) {
                //console.log(data);
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


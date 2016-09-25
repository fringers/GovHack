
app.controller('userReservationsController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Twoje rezerwacje";

    $scope.reservations = dbService.loadUserReservations();
    dbService.onUserReservationsUpdated(function() {
        $scope.reservations = loadUserReservations();
        if (!$scope.$$phase)
            $scope.$apply();
    });

    function loadUserReservations() {
        var reservs = dbService.getUserReservations();
        if(reservs == null)
            return [];

        var result = [];
        for(var id in reservs) {
            var res = reservs[id];
            if(res == null)
                continue;

            res.id = id;

            result.push(res);
        }
        return result;
    }

});



app.controller('mapController', function($rootScope, $scope, $mdDialog) {

    $scope.department = $rootScope.selectedDep;

    $rootScope.title = $scope.department.name;

    if (!$scope.$$phase)
        $scope.$apply();

    setTimeout(function() {
        if( $("#map")) {
            if( $("#map").gmap3) {
                $('#map').gmap3({
                    action: 'destroy'
                });
            }

            $("#map").html("");
        }

        myMaps.init();
        myMaps.geolocate(false, onLocationFound);

        $scope.department.marker = myMaps.addMarker(new point($scope.department.localization.lat, $scope.department.localization.lng), $scope.department.name);
        myMaps.center({lat: $scope.department.localization.lat, lng: $scope.department.localization.lng});

    }, 500);


    function onLocationFound(loc) {
        $scope.userLocMarker = myMaps.addMarker(new point(loc.lat, loc.lng), "Twoja pozycja", "https://lh4.ggpht.com/FRLzoxHDpRHxP6aFWxxQ1OUPlWnc55ZqnO7EpLtD8FBn6EK1zBerpF9P3BE3jJ6SFLNF7P0=w9-h9-rwa");

        myMaps.drawRoute(loc, {lat: $scope.department.localization.lat, lng: $scope.department.localization.lng});

        myMaps.getTransit(loc, {lat: $scope.department.localization.lat, lng: $scope.department.localization.lng}, function(result) {
            $scope.steps = result;

            if (!$scope.$$phase)
                $scope.$apply();
        });
    }
});


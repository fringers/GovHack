
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
        //myMaps.geolocate(false, onLocationFound);
        onLocationFound({lat: 52.213748, lng: 21.003177});

        $scope.department.marker = myMaps.addMarker(new point($scope.department.localization.lat, $scope.department.localization.lng), $scope.department.name);
        myMaps.center({lat: $scope.department.localization.lat, lng: $scope.department.localization.lng});

    }, 500);


    function onLocationFound(loc) {
        $scope.userLocMarker = myMaps.addMarker(new point(loc.lat, loc.lng), "Twoja pozycja", "https://lh4.ggpht.com/FRLzoxHDpRHxP6aFWxxQ1OUPlWnc55ZqnO7EpLtD8FBn6EK1zBerpF9P3BE3jJ6SFLNF7P0=w9-h9-rwa");
        
        myMaps.getUberPrice(loc.lat, loc.lng, $scope.department.localization.lat, $scope.department.localization.lng)
        .then(data => {
            $scope.walkInfo.uberEstimate = data.prices[0].estimate;
            if (!$scope.$$phase)
                $scope.$apply();
        });

        myMaps.getUberTime(loc.lat, loc.lng)
        .then(data => {
            $scope.walkInfo.uberDuration = "Przyjazd za " + (data.times[0].estimate/60) +" min";
            if (!$scope.$$phase)
                $scope.$apply();
        });

        myMaps.drawRoute(loc, {lat: $scope.department.localization.lat, lng: $scope.department.localization.lng});

        myMaps.getTransit(loc, {lat: $scope.department.localization.lat, lng: $scope.department.localization.lng}, function(result) {
            $scope.steps = result.segLists;
            $scope.stepsDur = result.dur;
            if (!$scope.$$phase)
                $scope.$apply();
        });

        myMaps.getTransit(loc, {lat: $scope.department.localization.lat, lng: $scope.department.localization.lng}, function(result) {
            $scope.walkInfo = result;
            if (!$scope.$$phase) 
                $scope.$apply();
        }, 'walking');

        myMaps.getTransit(loc, {lat: $scope.department.localization.lat, lng: $scope.department.localization.lng}, function(result) {
            $scope.driveInfo = result;

            if (!$scope.$$phase)
                $scope.$apply();
        }, 'driving');
    }
});


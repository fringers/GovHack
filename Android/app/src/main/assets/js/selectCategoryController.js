
app.controller('selectCategoryController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = "Kategorie spraw";

    $scope.caseCategories = loadCategories();

    $scope.goToCategory = goToCategory;

	$scope.selectedItem = null;
	$scope.selectedItemChange = selectedItemChange;
	$scope.cases = loadCases();
	$scope.selectedCases = loadUserCases();
	$scope.searchText = null;
    $scope.querySearch = querySearch;

    dbService.onCasesUpdate(function() {
        $scope.cases = loadCases();

        if (!$scope.$$phase)
            $scope.$apply();
    });

    dbService.onUserCasesUpdated(function() {
        $scope.selectedCases = loadUserCases();
        if (!$scope.$$phase)
            $scope.$apply();
    });

    dbService.onCaseCategoriesLoaded(function() {
        $scope.caseCategories = loadCategories();

        if (!$scope.$$phase)
            $scope.$apply();
    });
	
	function selectedItemChange(item) {
		if(item == undefined || item == null)
			return;
		
		$scope.selectedItem = undefined;
		$scope.searchText = '';
		
		for (var i = 0, len = $scope.selectedCases.length; i < len; i++) {
			if ($scope.selectedCases[i].id === item.id)
				return;
		}

		$rootScope.caseToCheck = item;
        $rootScope.category = getCategoryById(item.categoryId);

        $rootScope.navigate('selectCase');

/*
        dbService.getDetailsForCase(item, function() {
            $scope.selectedCases.push(item);
            dbService.addUserCase(item);
        });
        */
	}

	function getCategoryById(catId) {
	    for(var id in $scope.caseCategories) {
	        var c = $scope.caseCategories[id];
	        if(c.id == catId)
	            return c;
        }
        return null;
    }

	function querySearch (query) {
        return query ? filter($scope.cases, query) : [];
    }

    function filter(cases, query) {
        var result = [];
        var filterQuery = createFilterFor(query);
        for(var id in cases) {
            if(!cases.hasOwnProperty(id))
                continue;

            var c = cases[id];
            if(filterQuery(c))
                result.push(c);
        }
        return result;
    }

	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);

		return function filterFn(c) {
			for (var i = 0, len = $scope.selectedCases.length; i < len; i++) {
				if ($scope.selectedCases[i].id === c.id)
					return false;
			}
			
			return (c.name.toLowerCase().indexOf(lowercaseQuery) >= 0);
		};
    }

    function goToCategory(category) {
        $rootScope.category = category;
        $rootScope.navigate('selectCase');
    }

	function loadCases() {
        return dbService.getAllCases();
    }

    function loadCategories() {
        var result = [];
        var cats = dbService.getAllCaseCategories();
        for(var id in cats) {
            if(!cats.hasOwnProperty(id))
                continue;

            result.push(cats[id]);
        }

        return result;
    }

    function loadUserCases() {
        var userCases = dbService.getUserCases();
        if(userCases == null)
            return [];

        var result = [];
        for(var id in userCases) {
            if(!userCases.hasOwnProperty(id))
                continue;

            var c = dbService.getCaseById(userCases[id].case);
            if(c == null)
                continue;

            dbService.getDetailsForCase(c, function() {
                if (!$scope.$$phase)
                    $scope.$apply();
            });

            result.push(c);
        }
        return result;
    }
});

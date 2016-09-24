
app.controller('selectCaseController', function($rootScope, $scope, $mdDialog, dbService) {
	$rootScope.title = $rootScope.category.name;

    $scope.caseCategories = loadCategories();

    $scope.checkedDisabled = [];
    $scope.checked = [];

    $scope.confirm = confirm;

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

        $scope.checked[item.id] = true;

/*
        dbService.getDetailsForCase(item, function() {
            $scope.selectedCases.push(item);
            dbService.addUserCase(item);
        });
        */
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
		    if(c.category != $rootScope.category.id)
		        return false;

			for (var i = 0, len = $scope.selectedCases.length; i < len; i++) {
				if ($scope.selectedCases[i].id === c.id)
					return false;
			}
			
			return (c.name.toLowerCase().indexOf(lowercaseQuery) >= 0);
		};
    }

    function confirm() {
        for(var id in $scope.cases) {
            var c = $scope.cases[id];

            if(!$scope.checked[c.id] || $scope.checkedDisabled[c.id])
                continue;

            dbService.addUserCase(c);
        }


        $rootScope.navigate('main', false);
    }

	function loadCases() {
        var result = [];
        var cases = dbService.getAllCases();
        for(var id in cases) {
            if(!cases.hasOwnProperty(id))
                continue;

            if(cases[id].categoryId != $rootScope.category.id)
                continue;

            result.push(cases[id]);
        }
        return result;
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
        $scope.checkedDisabled = [];

        if($rootScope.caseToCheck) {
            //"#case-" + $rootScope.caseToCheck.id
           // $(window).scrollTop($("#case-" + $rootScope.caseToCheck.id).offset().top);
            /*var someElement = angular.element(document.getElementById("#case-" + $rootScope.caseToCheck.id));
            var container   = angular.element(documen('html'));
            container.scrollTo(someElement,0,1000);
*/
            var elemId = "#case-" + $rootScope.caseToCheck.id;
            setTimeout(function() {
                var elem = $(elemId);
                var offset = elem.offset();
                $('html,body').animate({
                        scrollTop: offset.top},
                    'slow');
            }, 100);


            //var chatBox = document.getElementById('chatBox');
            //chatBox.scrollTop = 300 + 8 + ($scope.messages.length * 240);

            $scope.checked[$rootScope.caseToCheck.id] = true;
            $rootScope.caseToCheck = null;
        }

        var userCases = dbService.getUserCases();
        if(userCases == null)
            userCases = [];

        var result = [];
        for(var id in userCases) {
            if(!userCases.hasOwnProperty(id))
                continue;

            var c = dbService.getCaseById(userCases[id].case);
            if(c == null)
                continue;

            if(!$rootScope.caseToCheck) {
                $scope.checkedDisabled.push(c.id);
                $scope.checked[c.id] = true;
            }


            dbService.getDetailsForCase(c, function() {
                if (!$scope.$$phase)
                    $scope.$apply();
            });

            result.push(c);
        }

        if($rootScope.caseToCheck) {
            $rootScope.caseToCheck = null;
        }

        return result;
    }
});

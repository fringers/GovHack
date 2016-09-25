app.factory('dbService', function() {
    var service = {};

    service._caseCategories = {};
    service._cases = {};
    service._offices = {};

    service._userCases = {};
    service._userReservations = {};

    service._onCaseCategoriesLoadedFns = [];
    service._onCasesUpdateFns = [];
    service._onUserCasesLoadedFns = [];
    service._onUserReservationsLoadedFns = [];

    initData();

    service.getAllCaseCategories = function () {
        return service._caseCategories;
    };

    service.getAllCases = function () {
        return service._cases;
    };

    service.getCaseById = function (id) {
        return service._cases[id];
    };

    service.getDetailsForCase = function (c, callback) {
        firebase.database().ref('/caseDetails/' + c.id).once('value').then(function(data) {
            c.details = data.val();


            if(c.details) {
                var docsArray = [];
                var docs = c.details.documents;
                for (var id in docs) {
                    var d = {
                        name: docs[id],
                        id: id
                    };

                    docsArray.push(d);
                }
                c.details.documents = docsArray;

                var stepsArray = [];
                var steps = c.details.steps;
                for (var id in steps) {
                    var d = {
                        name: steps[id],
                        id: id
                    };

                    stepsArray.push(d);
                }
                c.details.steps = stepsArray;

                var commentsArray = [];
                var comments = c.details.comments;
                for (var id in comments) {
                    var d = {
                        name: comments[id],
                        id: id
                    };

                    commentsArray.push(d);
                }
                c.details.comments = commentsArray;


                var count = 0;
                var uc = service.getUserCaseInfo(c);
                for(var sid in uc.step) {
                    if(uc.step[sid])
                        count++;
                }
                c.progress = "Wykonane kroki: " + count + "/" + c.details.steps.length;


                service.getLocationsByDetails(c.details);
            }

            setTimeout(function() {
                if (callback != null)
                    callback();
            }, 1000);
        });
    };

    service.getLocationsByDetails = function(caseDetails, callback) {
        var locs = caseDetails.locations;
        caseDetails.departments = [];

        for(var locId in locs) {
            var loc = locs[locId];

            firebase.database().ref('/locations/' + loc).once('value').then(function(data) {
                var locData = data.val();

                firebase.database().ref('/departments/' + locData.departmentId).once('value').then(function(data) {
                    var dep = data.val();
                    dep.id = locData.departmentId;
                    assignLocationToDetails(caseDetails, locData, dep);

                    if(callback != null)
                        callback();
                });
            });
        }
    };

    function assignLocationToDetails(caseDetails, locData, departmentData) {
        for(var id in caseDetails.departments) {
            var dep = caseDetails.departments[id];
            if(dep.id == departmentData.id) {
                dep.names.push(locData.name);
                dep.apiGroups.push(locData.apiGroup);
                return;
            }
        }

        departmentData.names = [];
        departmentData.names.push(locData.name);
        departmentData.apiGroups = [];
        departmentData.apiGroups.push(locData.apiGroup);
		departmentData.dist = distanceBetweenPoints(new point(52.213748, 21.003177), departmentData.localization);
        caseDetails.departments.push(departmentData);
    }

    service.getUserCaseInfo = function(c) {
        for(var id in service._userCases) {
            var uc = service._userCases[id];
            if(uc.case == c.id)
                return uc;
        }
        return null;
    };

    service.onCasesUpdate = function(fn) {
        service._onCasesUpdateFns.push(fn);
    };

    service.getUserCases = function() {
        return service._userCases;
    };

    service.loadUserCases = function() {
        var user = firebase.auth().currentUser;
        if(user == null)
            return;

        firebase.database().ref('/user/' + user.uid + '/cases/').once('value').then(function (snapshot) {
            service._userCases = snapshot.val();

            for(var id in service._userCases) {
                service._userCases[id].id = id;
            }

            notifyUserCasesUpdate();
        });
    };

    service.loadUserReservations = function() {
        var user = firebase.auth().currentUser;
        if(user == null)
            return;

        firebase.database().ref('/user/' + user.uid + '/reservations/').once('value').then(function (snapshot) {
            service._userReservations = snapshot.val();

            for(var id in service._userReservations) {
                var res = service._userReservations[id];
                res.id = id;

                for(var cid in service._userCases) {
                    var c = service._userCases[cid];
                    if(c.id == res.caseId) {
                        res.case = c;
                        break;
                    }
                }
            }

            notifyUserReservationsUpdate();
        });
    };

    function notifyUserCasesUpdate() {
        for(var id in service._onUserCasesLoadedFns) {
            service._onUserCasesLoadedFns[id]();
        }
    }

    function notifyUserReservationsUpdate() {
        for(var id in service._onUserReservationsLoadedFns) {
            service._onUserReservationsLoadedFns[id]();
        }
    }

    service.onUserCasesUpdated = function(fn) {
        service._onUserCasesLoadedFns.push(fn);
    };

    service.onUserReservationsUpdated = function(fn) {
        service._onUserReservationsLoadedFns.push(fn);
    };

    service.onCaseCategoriesLoaded = function(fn) {
        service._onCaseCategoriesLoadedFns.push(fn);
    };

    service.addUserCase = function(c) {
        var user = firebase.auth().currentUser;
        if(user == null)
            return;

        var userCase = {
            case: c.id
        };

        var path = '/user/' + user.uid + '/cases/';
        var newPostKey = firebase.database().ref().child(path).push().key;

        firebase.database().ref(path + newPostKey).set(userCase);

        service.loadUserCases();

        //var newPostKey = firebase.database().ref().child('/user/' + user.uid + '/cases/').push().key;
        //var updates = {};
       // updates['/user/' + user.uid + '/cases/' + newPostKey] = userCase;

       // firebase.database().ref().update(updates);
    };

    service.addUserReservation = function(res) {
        var user = firebase.auth().currentUser;
        if(user == null)
            return;

        var path = '/user/' + user.uid + '/reservations/';
        var newPostKey = firebase.database().ref().child(path).push().key;
        firebase.database().ref(path + newPostKey).set(userCase);

        service.loadUserReservations();
    };

    service.updateUserCase = function(uc) {
        var user = firebase.auth().currentUser;
        if(user == null)
            return;

        var path = '/user/' + user.uid + '/cases/';
        firebase.database().ref(path + uc.id).set(uc);

        service.loadUserCases();
    };

    service.removeUserCase = function(uc) {
        var user = firebase.auth().currentUser;
        if(user == null)
            return;

        firebase.database().ref('/user/' + user.uid + '/cases/' + uc.id).set(null);

        service.loadUserCases();
    };

    function initData() {
        loadAllCategories();
        loadAllCases();
        loadAllOffices();
    }

    function loadAllCategories() {
        firebase.database().ref('/caseCategory/').once('value').then(function (snapshot) {
            service._caseCategories = snapshot.val();

            for(var id in service._caseCategories) {
                service._caseCategories[id].id = id;
            }

            for(var id in service._onCategoryLoadedFns) {
                service._onCategoriesLoadedFns[id]();
            }
        });
    }

    function loadAllCases() {
        firebase.database().ref('/cases/').once('value').then(function (snapshot) {
            service._cases = snapshot.val();

            for(var id in service._cases) {
                service._cases[id].id = id;
            }

            for(var id in service._onCasesUpdateFns) {
                service._onCasesUpdateFns[id]();
            }
        });
    }

    function loadAllOffices() {
        firebase.database().ref('/departments/').once('value').then(function (snapshot) {
            service._offices = snapshot.val();

            for(var id in service._offices) {
                service._offices[id].id = id;
                service._offices[id].dist = distanceBetweenPoints(new point(52.213748, 21.003177), service._offices[id].localization);
            }

        });
    }

    return service;
});

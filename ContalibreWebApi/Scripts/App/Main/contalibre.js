(function () {
    var app = angular.module('contalibre');

    // SERVICES
    app.factory('contalibreService', function ($http, authTokenService) {

        var contabilidadesGetUrl = '/api/Contabilidades/User';
        var contabilidadesBaseUrl = '/api/Contabilidades';

        var service = {};

        service.getContabilidades = function (successCallback, failureCallback) {
            $http.get(contabilidadesGetUrl, authTokenService.getTokenHeader()).then(function (response) {
                successCallback(response.data);
            }, function (response) {
                if (failureCallback != null) failureCallback(response);
            });
        };

        service.createContabilidad = function (data, successCallback, failureCallback) {
            $http.post(contabilidadesBaseUrl, data, authTokenService.getTokenHeader()).then(function (response) {
                successCallback();
            }, function (response) {
                if (failureCallback != null) failureCallback(response);
            });
        };

        service.deleteContabilidad = function (id, successCallback, failureCallback) {
            $http.delete(contabilidadesBaseUrl + "/" + id, authTokenService.getTokenHeader()).then(function (response) {
                successCallback();
            }, function (response) {
                if (failureCallback != null) failureCallback(response);
            });
        };

        service.modifyContabilidad = function (data, successCallback, failureCallback) {
            $http.put(contabilidadesBaseUrl + "/" + data.Id, data, successCallback, failureCallback)
        };

        return service;
    });


    // CONTROLLERS

    app.controller('contalibreBaseController', ['$scope', '$http', '$controller', 'authTokenService', 'authLoginService', function ($scope, $http, $controller, authTokenService, authLoginService) {
        $controller('authLoginController', { $scope: $scope });

        var baseFunctions = {
            getData: null,
            createEntity: null,
            deleteEntity : null
        };

        $scope.data = {
            entities: [],
            newEntity: {},
            modifyingEntity: {}
        };

        $scope.errors = {
            lastError : null
        };

        $scope.isLoggedIn = authTokenService.isLoggedIn();
        $scope.editMode = false;

        $scope.startEntityModification = function (row) {
            $scope.editMode = true;
            $scope.data.modifyingEntity = row;
        };

        /***
         * Function from the contalibreService is expected, to which the standard success and failure callbacks will be added
         */
        $scope.setGetData = function (contalibreServiceGetFunction) {
            if (Helper.isFunction(contalibreServiceGetFunction)) {
                baseFunctions.getData = contalibreServiceGetFunction;
            }
        };

        $scope.setCreateEntity = function (contalibreServiceCreateFunction) {
            if (Helper.isFunction(contalibreServiceCreateFunction)) {
                baseFunctions.createEntity = contalibreServiceCreateFunction;
            }
        };

        /**
         * Function that takes the ID of the entry to delete from database, plus success and failure callbacks
         */
        $scope.setDeleteEntity = function (contalibreServiceDeleteFunction) {
            if (Helper.isFunction(contalibreServiceDeleteFunction)) {
                baseFunctions.deleteEntity = contalibreServiceDeleteFunction;
            }
        };

        /**
         * Function that takes as parameter a JS object with an ID (of the entry to modify in the database)
         * plus the rest of the values. Also success and failure callbacks
         */
        $scope.setModifyEntity = function (contalibreServiceModifyFunction) {
            if (Helper.isFunction(contalibreServiceModifyFunction)) {
                baseFunctions.modifyEntity = contalibreServiceModifyFunction;
            }
        };

        $scope.refreshData = function () {
            if (Helper.isFunction(baseFunctions.getData) && $scope.isLoggedIn) {
                baseFunctions.getData(function (data) {
                    $scope.data.entities = data;
                }, function (response) {
                    // process error
                });
            }
        };

        $scope.createEntity = function () {
            if (Helper.isFunction(baseFunctions.createEntity) && $scope.isLoggedIn) {
                baseFunctions.createEntity($scope.data.newEntity, function () {
                    $scope.refreshData();
                    $scope.data.newEntity = {};
                }, function (response) {
                    // process error
                });
            }
        };

        $scope.deleteEntity = function (id) {
            if (Helper.isFunction(baseFunctions.deleteEntity) && $scope.isLoggedIn) {
                baseFunctions.deleteEntity(id, function () {
                    $scope.refreshData();
                }, function (response) {
                    // process error
                });
            }
        };

        $scope.modifyEntity = function () {
            if (Helper.isFunction(baseFunctions.modifyEntity) && $scope.isLoggedIn) {
                baseFunctions.modifyEntity($scope.data.modifyingEntity, function () {
                    $scope.refreshData();
                    $scope.editMode = false;
                }, function (response) {
                    // process error
                });
            }
        };

        $scope.initialize = function () {
            $scope.refreshUserInfo();
            $scope.refreshData();
        };
    }]);

    app.controller('contalibreContabilidadesController', ['$scope', '$controller', 'authLoginService', 'contalibreService', function ($scope, $controller, authLoginService, contalibreService) {
        $controller('contalibreBaseController', { $scope: $scope });

        $scope.data = {};
        $scope.setGetData(contalibreService.getContabilidades);
        $scope.setCreateEntity(contalibreService.createContabilidad);
        $scope.setDeleteEntity(contalibreService.deleteContabilidad);
        $scope.setModifyEntity(contalibreService.modifyContabilidad);

        authLoginService.addNotifyLoginChange($scope.refreshUserInfo);
        authLoginService.addNotifyLoginChange($scope.initialize);

        $scope.$on("$destroy", function () {
            authLoginService.removeNotifyLoginChange($scope.refreshUserInfo);
            authLoginService.removeNotifyLoginChange($scope.initialize);
        });

        $scope.initialize();
    }]);
})();
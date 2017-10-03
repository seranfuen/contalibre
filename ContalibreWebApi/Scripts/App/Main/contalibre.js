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

        service.deleteContabilidad = function (id, successCallback, failurecallback) {
            $http.delete(contabilidadesBaseUrl + "/" + id, authTokenService.getTokenHeader()).then(function (response) {
                successCallback();
            }, function (response) {
                if (failureCallback != null) failureCallback(response);
            });
        }

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
        };

        $scope.errors = {
            lastError : null
        };

        $scope.isLoggedIn = authTokenService.isLoggedIn();

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

        $scope.setDeleteEntity = function (contalibreServiceDeleteFunction) {
            if (Helper.isFunction(contalibreServiceDeleteFunction)) {
                baseFunctions.deleteEntity = contalibreServiceDeleteFunction;
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

        authLoginService.addNotifyLoginChange($scope.refreshUserInfo);
        authLoginService.addNotifyLoginChange($scope.initialize);

        $scope.$on("$destroy", function () {
            authLoginService.removeNotifyLoginChange($scope.refreshUserInfo);
            authLoginService.removeNotifyLoginChange($scope.initialize);
        });

        $scope.initialize();
    }]);
})();
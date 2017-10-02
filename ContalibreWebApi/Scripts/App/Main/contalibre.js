(function() {
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

    app.controller('contalibreContabilidadesController', ['$scope', '$controller', 'authLoginService', 'contalibreService', function ($scope, $controller, authLoginService, contalibreService) {
        $controller('contalibreBaseController', { $scope: $scope });

        $scope.data = {};

        var refreshContabilidades = function () {
            if ($scope.isLoggedIn) {
                contalibreService.getContabilidades(function (data) {
                    $scope.data.contabilidades = data;
                }, function (response) {

                });
            }
        };

        $scope.refreshUserInfo();

        $scope.data.newEntity = {
            Company: null,
            Year: null,
        };

        refreshContabilidades();

        $scope.addContabilidad = function () {
            contalibreService.createContabilidad($scope.data.newEntity, function () {
                $scope.data.newEntity = {
                    Company: null,
                    Year: null
                };
                $scope.contabilidadForm.$setPristine();
                refreshContabilidades();
            }, function (response) {

            });
        };

        $scope.deleteContabilidad = function (id) {
            contalibreService.deleteContabilidad(id, function () {
                refreshContabilidades();
            }, function (response) {

            });
        };

        authLoginService.addNotifyLoginChange($scope.refreshUserInfo);
        authLoginService.addNotifyLoginChange(refreshContabilidades);

        $scope.$on("$destroy", function () {
            authLoginService.removeNotifyLoginChange($scope.refreshUserInfo);
            authLoginService.removeNotifyLoginChange(refreshContabilidades);
        })
    }]);
})();
(function() {
    var app = angular.module('contalibre');

    // SERVICES

    app.factory('contalibreService', function ($http, authTokenService) {

        var contabilidadesGetUrl = '/api/Contabilidades/User';

        var service = {};

        service.getContabilidades = function (successCallback, failureCallback) {
            $http.get(contabilidadesGetUrl, authTokenService.getTokenHeader()).then(function (response) {
                successCallback(response.data);
            }, function (response) {
                if (failureCallback != null) failureCallback(response);
            });
        };

        return service;
    });


    // CONTROLLERS

    app.controller('contalibreContabilidadesController', ['$scope', '$controller', 'authLoginService', 'contalibreService', function ($scope, $controller, authLoginService, contalibreService) {
        $controller('contalibreBaseController', { $scope: $scope });

        $scope.refreshUserInfo();

        var refreshContabilidades = function () {
            if ($scope.isLoggedIn) {
                $scope.contabilidades = contalibreService.getContabilidades();
            }
        };

        authLoginService.addNotifyLoginChange($scope.refreshUserInfo);
        authLoginService.addNotifyLoginChange(refreshContabilidades);

        $scope.$on("$destroy", function () {
            authLoginService.removeNotifyLoginChange($scope.refreshUserInfo);
            authLoginService.removeNotifyLoginChange(refreshContabilidades);
        })
    }]);
})();
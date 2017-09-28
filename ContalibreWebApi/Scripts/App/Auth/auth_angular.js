(function () {
    var app = angular.module('contalibre', []);

    app.factory('authTokenService', function () {
        var tokenKey = 'currentUser';

        return {
            setToken: function (token, persist) {
                if (persist) {
                    localStorage.setItem(tokenKey, token);
                } else {
                    sessionStorage.setItem(tokenKey, token);
                }
            },
            getToken: function () {
                var localItem = localStorage.getItem(tokenKey);
                if (localItem == null) {
                    return sessionStorage.getItem(tokenKey);
                } else {
                    return localItem;
                }
            },
            removeToken: function () {
                localStorage.removeItem(tokenKey);
                sessionStorage.removeItem(tokenKey);
            },
            isLoggedIn: function () {
                return localStorage.getItem(tokenKey) != null || sessionStorage.getItem(tokenKey) != null;
            }
        };
    });

    app.factory('authLoginService', function ($http, authTokenService) {
        var tokenUrl = '/token';

        var configHeader = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        return {
            /***
             * Attempts to log in the service and saves the token returned by the server if successful onto the local or session storages
             * loginData is an object with the fields username and password
             * persistToken is a boolean. If true, will save the token in the localStorage, otherwise in the sessionStorage
             * successCallback is a callback function of the form successCallback(token) where the token will be the token returned by the server
             * failureCallback is a callback function of the form failureCallback(response) with the reponse data from the server indicating the cause of the failure
             */
            login: function (loginData, persistToken, successCallback, failureCallback) {
                loginData.grant_type = 'password';
   
                $http.post(tokenUrl, $.param(loginData), configHeader).then(function (response) {
                    authTokenService.setToken(response.data.access_token, persistToken);
                    if (successCallback != null) successCallback(response.data.access_token);
                }, function (response) {
                    if (failureCallback != null) failureCallback(response);
                });
            },
            logoff: function () {
                authTokenService.removeToken();
            }
        };
    });

    app.controller('authLoginController', ['$scope', '$http', 'authTokenService', 'authLoginService', function ($scope, $http, authTokenService, authLoginService) {
        $scope.loginData = {
            email: '',
            password: '',
            rememberMe: true
        };

        $scope.login = function () {
            var data = {
                username: $scope.loginData.email,
                password: $scope.loginData.password
            };

            authLoginService.login(data, $scope.rememberMe, function (token) {
                $scope.isLoggedIn = true;
            }, function (response) {
                $scope.isLoggedIn = false;
                $scope.loginResult = "Log in failed: " + response.data.error;
                $scope.loginResultClass = "login-failed";
            });
        };

        $scope.logoff = function () {
            authLoginService.logoff();
            $scope.isLoggedIn = false;
        };

        $scope.isLoggedIn = authTokenService.isLoggedIn();;
    }]);

    //$scope.register = {
    //    Password: '',
    //    ConfirmPassword: '',
    //    Email: ''
    //};

    //$scope.performRegister = function () {
    //    $http.post('/api/Account/Register', JSON.stringify($scope.register)).then(function (response) {
    //        $scope.registerResult = "Registered successfully";
    //        $scope.registerResultClass = "";
    //    }, function (response) {
    //        $scope.registerResult = "Register failed: " + response.data.Message;
    //        $scope.registerResultClass = "register-failed";
    //    });
    //};


})();

/** Testing **/
(function () {
    var app = angular.module('contalibre');
    app.controller('contalibreAuthTestController', ['$scope', '$http', 'authTokenService', function ($scope, $http, authTokenService) {
        var testUrl = '/api/values';

        $scope.performTest = function () {
            var config = {};
            config.headers = {};
            config.headers.Authorization = "Bearer " + authTokenService.getToken();

            $http.get(testUrl, config).then(function (response) {
                $scope.testResult = response.data;
                $scope.testResultClass = "";
            }, function (response) {
                $scope.testResult = "Test failed: " + response.data.Message;
                $scope.testResultClass = "test-failed";
            });
        };
    }]);
})();
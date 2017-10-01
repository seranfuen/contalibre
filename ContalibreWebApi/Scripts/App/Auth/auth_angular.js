(function () {
    var app = angular.module('contalibre', []);

    app.factory('authTokenService', function () {
        var tokenKey = 'currentUser';

        var getToken = function () {
            var localItem = localStorage.getItem(tokenKey);
            if (localItem == null) {
                return sessionStorage.getItem(tokenKey);
            } else {
                return localItem;
            }
        };

        return {
            setToken: function (token, persist) {
                if (persist) {
                    localStorage.setItem(tokenKey, token);
                } else {
                    sessionStorage.setItem(tokenKey, token);
                }
            },
            getToken: getToken,
            getTokenHeader: function () {
                var config = {};
                config.headers = {};
                config.headers.Authorization = "Bearer " + getToken();
                return config;
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
        var userInfoUrl = '/api/Account/UserInfo';

        var configHeader = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        var loginNotificationCallbacks = [];

        var userInfo = null;

        var onLoginChanged = function () {
            for (var i = 0; i < loginNotificationCallbacks.length; i++) {
                loginNotificationCallbacks[i]();
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
                    onLoginChanged();
                }, function (response) {
                    if (failureCallback != null) failureCallback(response);
                });
            },
            logoff: function () {
                authTokenService.removeToken();
                userInfo = null;
                onLoginChanged();
            },
            /**
             *  If the user is logged in, retrieves the user info and caches it for future calls
             * successCallback takes one parameter, userInfo, with the user info if it's cached or successfully retrieved
             * failureCallback takes as parameter a response object
             */
            getUserInfo: function (successCallback, failureCallback) {
                if (userInfo != null) {
                    successCallback(userInfo);
                } else {
                    $http.get(userInfoUrl, authTokenService.getTokenHeader()).then(function (response) {
                        userInfo = response.data;
                        successCallback(userInfo);
                    }, function (reponse) {
                        if (failureCallback) failureCallback(response);
                    });
                }
            },
            // The callback is only used to inform callers that a change in log in status has happened (user logged in successfully or logged out)
            addNotifyLoginChange: function (callback) {
                loginNotificationCallbacks.push(callback);
            },
            removeNotifyLoginChange: function (callback) {
                loginNotificationCallbacks.removeItem(callback);
            }
        };
    });

    app.controller('contalibreBaseController', ['$scope', '$http', 'authTokenService', 'authLoginService', function ($scope, $http, authTokenService, authLoginService) {
        $scope.refreshUserInfo = function () {
            $scope.isLoggedIn = authTokenService.isLoggedIn();

            if ($scope.isLoggedIn) {
                authLoginService.getUserInfo(function (userInfo) {
                    $scope.userInfo = userInfo;
                }, null);
            } else {
                $scope.userInfo = null;
            }
        };
    }]);

    app.controller('authLoginController', ['$scope', '$http', '$controller', 'authTokenService', 'authLoginService', function ($scope, $http, $controller, authTokenService, authLoginService) {

        $controller('contalibreBaseController', { $scope: $scope });

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

        $scope.refreshUserInfo();
    }]);

    app.factory('registerService', function ($http) {
        var registerUrl = '/api/Account/Register';

        return {
            /***
             * Attempts to register the user with the data given (Password, ConfirmPassword, Email). SuccessCallback is a parameterless callback on success
             * failureCallback takes response as parameter
             */
            register: function (data, successCallback, failureCallback) {
                $http.post(registerUrl, JSON.stringify(data)).then(function (response) {
                    if (successCallback) successCallback();
                }, function (response) {
                    if (failureCallback) failureCallback(response);
                });
            }
        };
    });

    app.controller('registerController', ['$scope', 'registerService', function ($scope, registerService) {
        $scope.data = {
            password: '',
            confirmPassword: '',
            email: ''
        };

        $scope.register = function () {
            registerService.register($scope.data, function () {
                // hide register, show message that it's completed'
            }, function (response) {
                $scope.registerResult = 'Error: ' + response.data.Message;
            });
        };
    }]);
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
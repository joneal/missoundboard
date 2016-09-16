// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('Samtec.Anduin.Installer.Web')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$scope', 'cache', '$timeout', 'LoginService', '$uibModal', '$window', '$cookies', '$http', 'UtilService'];

    function LoginController($rootScope, $scope, cache, $timeout, LoginService, $uibModal, $window, $cookies, $http, UtilService) {


        $scope.onLoginClick = function () {

            // Clear token and cookie
            clearAll();

            LoginService.LoginUserPwd($scope.User.Username, $scope.User.Password)
                .then(function success(jwt) {
                    manageSuccessJwt(jwt);
                })
                .catch(function (err) {
                    manageFailureJwt(err, $scope.User.Username);
                });
        };

        function manageSuccessJwt(jwt) {
            var jwtComponents = jwt.split('.');
            var jwtPayload = $window.atob(jwtComponents[1]);
            jwtPayload = JSON.parse(jwtPayload);

            cache.Username = jwtPayload.username;
            cache.Displayname = jwtPayload.displayname;
            cache.Role = jwtPayload.role;
            cache.Token = jwt;
            $http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

            var now = new Date();
            var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
            $cookies.put('username', cache.Username, { expires: exp });
            $cookies.put('role', cache.Role, { expires: exp });
            $cookies.put('token', cache.Token, { expires: exp });

            $rootScope.$broadcast('user-login', cache.Displayname);

            // See if this user is allowed to see admin menu
            checkPermissions();

            $window.location.replace('/#/!!home');

            $scope.User.BadgeNumber = null;
            $scope.User.Username = null;
            $scope.User.Password = null;
        }

        function manageFailureJwt(err, user) {
            clearAll();

            $rootScope.$broadcast('user-login', '');

            var msg = '';
            switch (err) {
                case 401:
                    msg = cache.Strings.LOGIN_401;
                    break;
                case 403:
                    msg = cache.Strings.LOGIN_403;
                    break;
                case 404:
                    msg = cache.Strings.LOGIN_404;
                    break;
                default:
                    msg = '';
                    break;
            }

            UtilService.Error(cache.Strings.LOGIN_FAILURE + '<br/><br/><b>' + msg + '</b>');

            $scope.User.BadgeNumber = null;
            $scope.User.Username = null;
            $scope.User.Password = null;
        }

        function clearAll() {
            cache.Username = '';
            cache.Displayname = '';
            cache.Role = '';
            cache.Token = '';
            $cookies.remove('username');
            $cookies.remove('role');
            $cookies.remove('token');
            delete $http.defaults.headers.common.Authorization;
        }

        function checkPermissions() {
            var role = cache.Role.toUpperCase();
            var isUserPermitted = (role === 'ADMINISTRATOR' || role === 'MANAGER' || role === 'TECHNICIAN');

            $rootScope.$broadcast('manage-admin-menu', isUserPermitted);
        }

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

        })();
    }
})();
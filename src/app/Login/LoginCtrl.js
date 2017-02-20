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

    LoginController.$inject = ['$rootScope', '$scope', 'cache', '$timeout', 'LoginService', '$uibModal', '$window', '$http', 'UtilService'];

    function LoginController($rootScope, $scope, cache, $timeout, LoginService, $uibModal, $window, $http, UtilService) {

        cache.Token = '';

        $scope.onLoginClick = function () {
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
            cache.Token = jwtPayload;            
            $window.location.replace('/#/!!home');
        }

        function manageFailureJwt(err, user) {
            $scope.User.Username = '';
            $scope.User.Password = '';
            var msg = '';
            switch (err) {
                case 401:
                    msg = 'UNAUTHORIZED!';
                    break;
                case 403:
                    msg = 'FORBIDDEN!';
                    break;
                case 404:
                    msg = 'Not Found!';
                    break;
                default:
                    msg = '';
                    break;
            }
            UtilService.Error('Login failure' + '<br/><br/><b>' + msg + '</b>');
        }
    }
})();
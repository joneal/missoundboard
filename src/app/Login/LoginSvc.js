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
        .factory('LoginService', LoginService);

    LoginService.$inject = ['ENV', 'DataService', '$http', '$q', '$window', 'cache'];

    function LoginService(ENV, DataService, $http, $q, $window, cache) {
     
        function loginUserPwd(username, password){
            var deferred = $q.defer();

            var urlBase = ENV.USERSVC.protocol + '://' + ENV.USERSVC.server + ':' + ENV.USERSVC.port + '/v1/users/validate';

            var userCredentialsToken = $window.btoa(username + ':' + password + ':' + cache.App);
            
            $http.defaults.headers.common.Authorization = 'Basic ' + userCredentialsToken;
             
            var promise = DataService.PostMethod(urlBase);

            promise.then(function success(apiKey) {
                delete $http.defaults.headers.common.Authorization;
                deferred.resolve(apiKey);
            },
            function error(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        return {           
            LoginUserPwd: loginUserPwd
        };
    }
})();
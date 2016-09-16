// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('Samtec.Anduin.Installer.Web')
        .factory('DataService', DataService);

    DataService.$inject = ['$http', '$q', '$window', '$rootScope', 'NetworkErrorService', 'cache'];

    function DataService($http, $q, $window, $rootScope, NetworkErrorService, appCache) {

        var timeoutSeconds = 30; 

        function baseDataMethod(url, verb, data, cache) {

            // Send event to show any type of UI indicator that we are waiting on the server
            $rootScope.$broadcast('blocker-request-event');

            var deferred = $q.defer();

            $http({
                method: verb,
                url: url,
                data: data,
                timeout: timeoutSeconds * 1000,
                cache: cache,
                withCredentials: false
            }).
            success(function (data, status, headers, config) {

                // Send event to hide UI indicator
                $rootScope.$broadcast('blocker-response-event');

                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {

                // Send event to hide UI indicator
                $rootScope.$broadcast('blocker-error-event');

                //var networkErrorMessage = NetworkErrorService.GetNetworkErrorMessage(status);

                // Broadcast that a network error was received
                // 2 corresponds to error type.
                //$rootScope.$broadcast('notify-message-event', [appCache.NotifyMessageTypes.Error, networkErrorMessage]);

                deferred.reject(status);
            });

            return deferred.promise;
        }

        function getMethod(url) {
            return baseDataMethod(url, 'GET', null, false);
        }

        function getCacheMethod(url) {
            return baseDataMethod(url, 'GET', null, true);
        }

        function putMethod(url, data) {
            return baseDataMethod(url, 'PUT', data, false);
        }

        function postMethod(url, data) {
            return baseDataMethod(url, 'POST', data, false);
        }

        function deleteMethod(url, data) {
            return baseDataMethod(url, 'DELETE', data, false);
        }

        return {
            GetMethod: getMethod,
            GetCacheMethod: getCacheMethod,
            PutMethod: putMethod,
            PostMethod: postMethod,
            DeleteMethod: deleteMethod
        };
    }

})();
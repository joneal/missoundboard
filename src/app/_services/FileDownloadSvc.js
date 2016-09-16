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
        .factory('FileDownloadService', FileDownloadService);

    FileDownloadService.$inject = ['$http', '$q', '$rootScope', 'NetworkErrorService', 'cache'];

    function FileDownloadService($http, $q, $rootScope, NetworkErrorService, appCache) {

        var timeoutSeconds = 30;

        function baseDataMethod(url) {

            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: url,
                timeout: timeoutSeconds * 1000,
                withCredentials: true,
                responseType: 'arraybuffer',
                requestTimestamp: new Date().getTime(),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });

            return deferred.promise;
        }

        return {
            DownloadFile: baseDataMethod
        };
    }

})();
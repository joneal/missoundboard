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
        .factory('HomeService', HomeService);

    HomeService.$inject = ['cache', 'UtilService'];

    function HomeService(cache, UtilService) {

        function downloadS3Object(path){
            return new Promise(function(resolve, reject){
            cache.S3.getObject({ Bucket: 'anduin-installers', Key: path }, function (err, data) {
                if (!err) {
                   
                } else {
 UtilService.Error(err);
                    reject(err);
                }
            });
            });
        }

        return {
            downloadS3Object: downloadS3Object
        };
    }

})();
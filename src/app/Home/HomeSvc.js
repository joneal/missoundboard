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
        .factory('HomeService', HomeService);

    HomeService.$inject = ['ENV', 'DataService', 'cache'];

    function HomeService(ENV, DataService, cache) {

        // var urlBase = ENV.APISVC.protocol + '://' + ENV.APISVC.server + ':' + ENV.APISVC.port + '/v1/reports/';

        // function getBoardCheckoutStatus(facility, days) {
        //     var url = urlBase + 'checkout/' + facility + '/' + days;
        //     return DataService.GetMethod(url);
        // }

        return {
            // GetBoardCheckoutStatus: getBoardCheckoutStatus
        };
    }
})();
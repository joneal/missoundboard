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
        function getStationData() {
            return new Promise(function (resolve, reject) {
                resolve([
                    { Station: 'RF', Build: '2016.09.09.1123', ReleaseDate: '2016-09-09T11:23:00.000Z', Description: 'This is a brief release description', ReleaseNotes: 'Release Notes' },
                    { Station: 'Leakage Tester', Build: '2016.10.06.0623', ReleaseDate: '2016-10-03T06:23:00.000Z', Description: 'This is a brief release description', ReleaseNotes: 'Release Notes' }
                ]);
            });
        }

        function getComponentData() {
            return new Promise(function (resolve, reject) {
                resolve([
                    { Package: 'Anduin', Build: '2016.09.09.1123', ReleaseDate: '2016-09-09T11:23:00.000Z', Description: 'This is a brief release description', ReleaseNotes: 'Release Notes' },
                    { Package: '.NET Framework', Build: '2016.10.06.0623', ReleaseDate: '2016-10-03T06:23:00.000Z', Description: 'This is a brief release description', ReleaseNotes: 'Release Notes' }
                ]);
            });
        }

        return {
            GetStationData: getStationData,
            GetComponentData: getComponentData
        };
    }
})();
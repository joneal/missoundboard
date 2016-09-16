// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function utilsvc() {

    'use strict';

    angular
        .module('Samtec.Anduin.Installer.Web')
        .factory('UtilService', UtilService);

    UtilService.$inject = ['$rootScope', '$q', 'ENV', 'cache'];

    function UtilService($rootScope, $q, ENV, cache) {

        // Private function to validate user entered number.
        // Must not be blank and must be a number
        function validateNumber(number) {
            var res = true;

            // Only validate if the user actually entered a number.
            if (number) {
                res = !isNaN(parseFloat(number)) && isFinite(number);
            }

            return res;
        }

        function stringFormat() {
            // The string containing the format items (e.g. "{0}")
            // will and always has to be the first argument.
            var theString = arguments[0];

            // start with the second argument (i = 1)
            for (var i = 1; i < arguments.length; i++) {
                // "gm" = RegEx options for Global search (more than one instance)
                // and for Multiline search
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, arguments[i]);
            }

            return theString;
        }

        function broadcastMsg(type, header, message) {
            $rootScope.$broadcast('notify-message-event', [type, header, message]);
        }

        function broadcastSuccess(header, message) {
            broadcastMsg(cache.NotifyMessageTypes.Success, header, message);
        }

        function broadcastWarning(header, message) {
            broadcastMsg(cache.NotifyMessageTypes.Warning, header, message);
        }

        function broadcastError(header, message) {
            broadcastMsg(cache.NotifyMessageTypes.Error, header, message);
        }

        function stringComparator(str1, str2) {
            if ((str1 === null) && (str2 === null)) {
                return 0;
            }

            if (str1 === null) {
                return -1;
            }

            if (str2 === null) {
                return 1;
            }

            return str1.localeCompare(str2);
        }

        return {
            ValidateNumber: validateNumber,
            StringFormat: stringFormat,
            Success: broadcastSuccess,
            Warning: broadcastWarning,
            Error: broadcastError,
            StringComparator: stringComparator
        };
    }

})();
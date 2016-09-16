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
        .factory('NetworkErrorService', NetworkErrorService);

    NetworkErrorService.$inject = [];

    function NetworkErrorService() {

        var contact = {
            None: 0,
            Samtec: 1,
            NetworkAdmin: 2
        };

        var msgs = {
            "-1": { msg: "Network connectivity issues detected...or a web service is offline.  Please try again..if errors persist then please contact the Help Desk.", contact: contact.None },
            "0": { msg: "Network connectivity issues detected...or a web service is offline.  Please try again..if errors persist then please contact the Help Desk.", contact: contact.None },
            "400": { msg: "Bad Request.", contact: contact.Samtec },
            "401": { msg: "Unauthorized. You do not have permission to perform this operation.", contact: contact.Samtec },
            "403": { msg: "Forbidden.  You are up to no good....please stop.", contact: contact.None },
            "404": { msg: "Not Found", contact: contact.Samtec },
            "405": { msg: "Method Not Allowed.", contact: contact.Samtec },
            "406": { msg: "Not Acceptable.", contact: contact.Samtec },
            "407": { msg: "Proxy Authentication Required.", contact: contact.NetworkAdmin },
            "408": { msg: "Request Timeout.", contact: contact.NetworkAdmin },
            "411": { msg: "Length Required.", contact: contact.NetworkAdmin },
            "419": { msg: "Authentication Timeout.  Please try again...if error persists then please contact your network administrator.", contact: contact.None },
            "500": { msg: "Internal Server Error.", contact: contact.Samtec },
            "501": { msg: "Not Implemented.", contact: contact.Samtec },
            "502": { msg: "Bad Gateway.", contact: contact.Samtec },
            "503": { msg: "Service Unavailable.", contact: contact.Samtec },
            "504": { msg: "Gateway Timeout.", contact: contact.Samtec },
            "511": { msg: "Network Authentication Required.", contact: contact.Samtec },
            "522": { msg: "Connection timed out.", contact: contact.Samtec },
            "598": { msg: "Network read timeout error.", contact: contact.Samtec },
            "599": { msg: "Network connect timeout error.", contact: contact.Samtec }
        };

        function getMessage(status) {

            var res = "";

            var message = msgs[status];

            if (message === null) {
                res = "Communication error [" + status + "].  Please contact your network administrator.";
            } else {
                if (status === 0) {
                    res = message.msg;
                } else {
                    if (message.contact === contact.None) {
                        res = "[" + status + "] " + message.msg;
                    } else if (message.contact === contact.Samtec) {
                        res = "[" + status + "] " + message.msg + "  Please contact the help desk.";
                    } else if (message.contact === contact.NetworkAdmin) {
                        res = "[" + status + "] " + message.msg + "  Please contact your network administrator.";
                    }
                }
            }

            return res;
        }

        return {
            GetNetworkErrorMessage: getMessage
        };
    }

})();
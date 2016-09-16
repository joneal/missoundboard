// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('config', [])
        .constant('ENV',
        {
            // http://xxxxx.samtec-atg.com:5850
            'APISVC': {
                'protocol': 'http',
                'server': 'localhost',
                'port': 5850
            }
        });
})();
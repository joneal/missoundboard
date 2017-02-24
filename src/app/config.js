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
            // https://atgusersvc.samtec-atg.com:5820
            'USERSVC': {
                'protocol': 'https',
                'server': 'atgusersvc.samtec-atg.com',
                'port': 5820
            },         
            AWS_ACCESS_KEY_ID: 'AKIAIFUWTEIEHBBWP5UA',
            AWS_SECRET_ACCESS_KEY: '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'
        });
})();
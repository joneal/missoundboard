﻿// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('Samtec.Anduin.Installer.Web')
        .factory('cache', cache);

    cache.$inject = ['$q'];

    function cache($q) {

        var app = 'etestinv';
        var secret = '01011976';       
        var username = '';
        var displayName = '';
        var roles = [];
        var token = '';
       
        return {

            NotifyMessageTypes: {
                Information: 0,
                Warning: 1,
                Error: 2
            },

            App: app,
            Secret: secret,           
            Username: username,
            Displayname: displayName,
            Roles: roles,
            Token: token
        };
    }

})();
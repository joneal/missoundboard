// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('Samtec.MIS.Soundboard.Web', [
            'ngRoute',
            'toastr',
            'ui.bootstrap'          
        ])
        .config(configHandler);

    //
    // Manage configuration items
    //
    configHandler.$inject = ['$provide'];

    function configHandler($provide) {

        // Wrap the default Angular exception handler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', '$injector'];

    // Extend the default Angular exception handler
    function extendExceptionHandler($delegate, $injector) {
        return function (exception, cause) {
            $delegate(exception, cause);

            // Must manually create the 'toastr' object.  Cannot inject because
            // it will introduce circular dependencies.
            $injector.invoke(function (toastr) {
                var msg2 = (cause !== undefined) ? cause : '';
                toastr.error(exception.message + '  ' + msg2, 'Anduin Installer Exception');
            });
        };
    }

})();
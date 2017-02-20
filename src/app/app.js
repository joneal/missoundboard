// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    // get ag-Grid to create an Angular module and register the ag-Grid directive
    agGrid.initialiseAgGridWithAngular1(angular);

    angular
        .module('Samtec.Anduin.Installer.Web', [
            'config',
            'ngRoute',
            'ngSanitize',
            'ngAnimate',
            'agGrid',
            'toastr',
            'ui.bootstrap',
            'ng.jsoneditor'            
        ])
        .config(configHandler)
        .run(runHandler);

    //
    // Manage configuration items
    //
    configHandler.$inject = ['$provide'];

    function configHandler($provide) {

        // Wrap the default Angular exception handler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', '$injector', '$window'];

    // Extend the default Angular exception handler
    function extendExceptionHandler($delegate, $injector, $window) {
        return function (exception, cause) {
            $delegate(exception, cause);

            // Must manually create the 'toastr' object.  Cannot inject because
            // it will introduce circular dependencies.
            $injector.invoke(function (toastr) {
                var msg2 = (cause !== undefined) ? cause : '';
                toastr.error(exception.message + '  ' + msg2, 'Anduin Installer Exception');
                $window.location.replace('/#/login/');
            });
        };
    }

    //
    // Manage initialiation items
    //
    runHandler.$inject = ['$rootScope', '$location', 'cache'];

    function runHandler($rootScope, $location, cache) {     

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = (cache.Token !== '');

            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
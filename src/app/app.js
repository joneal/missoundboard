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
            'ngCookies',
            'agGrid',
            'toastr',
            'ui.bootstrap',
            //'samtec-blocker', 'samtec-checkbox', 'samtec-focus', 'samtec-highlight-text',
            //'samtec-navigation', 'samtec-search', 'samtec-validate-email', 'samtec-button-save-effect',
            'LocalStorageModule'
        ])
        .config(configHandler)
        .run(runHandler);

    //
    // Manage configuration items
    //
    configHandler.$inject = ['$httpProvider', '$provide', 'localStorageServiceProvider'];

    function configHandler($httpProvider, $provide, localStorageServiceProvider) {

        // Configure $http service to use CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Wrap the default Angular exception handler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        // Configure local storage
        localStorageServiceProvider.setPrefix('anduin-installer');
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
    runHandler.$inject = ['$rootScope', '$cookieStore', '$window', '$http', '$location', '$cookies', 'cache', 'localStorageService'];

    function runHandler($rootScope, $cookieStore, $window, $http, $location, $cookies, cache, localStorageService) {     

        cache.Username = $cookies.get('username') || '';
        cache.Token = $cookies.get('token') || '';

        if (cache.Token !== '') {
            $http.defaults.headers.common.Authorization = 'Bearer ' + cache.Token;
        }
        else {
            delete $http.defaults.headers.common.Authorization;
        }

        // $rootScope.$on('$locationChangeStart', function (event, next, current) {
        //     var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
        //     var loggedIn = cache.Token;

        //     if (restrictedPage && !loggedIn) {
        //         $location.path('/login');
        //     }
        // });
    }

})();
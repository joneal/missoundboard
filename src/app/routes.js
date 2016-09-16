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
        .config(router);

    router.$inject = ['$routeProvider'];

    function router($routeProvider) {        
        $routeProvider.when('/login', { templateUrl: 'Login/Login.html', controller: 'LoginController' });
        $routeProvider.when('/!!home', { templateUrl: 'Home/Home.html', controller: 'HomeController' });       
        $routeProvider.otherwise({ redirectTo: '/!!home' });
    }

})();
